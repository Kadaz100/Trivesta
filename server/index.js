import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { Connection, PublicKey } from "@solana/web3.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ==== Your deposit addresses (same as your frontend) ====
const WALLETS = {
  BTC: "1J9bGCeb9vbsfBrwy5xGTCUq8Gytfigv54",
  ETH: "0x96ae958a7c672450ef83d07c51629c182869fc13".toLowerCase(),
  USDT: "TGjBM57ocB34NgMNcSuEfZWWXwcHko6hwv", // TRC20 on Tron
  SOL: "7PuTwMcNdGftUXmquSu9YQRZ89SuaPenAsk5WTw195J9"
};

// === Helpers ===
const ok = (res, data) => res.json({ success: true, ...data });
const notOk = (res, msg, extra={}) => res.json({ success: false, message: msg, ...extra });

// ---------- BTC (via Blockstream API) ----------
async function verifyBTC(txid) {
  // Docs: https://blockstream.info/api/
  const txUrl = `https://blockstream.info/api/tx/${txid}`;
  const confUrl = `https://blockstream.info/api/tx/${txid}/status`;
  const [txResp, stResp] = await Promise.all([fetch(txUrl), fetch(confUrl)]);
  if (!txResp.ok || !stResp.ok) throw new Error("BTC API error");

  const tx = await txResp.json();
  const status = await stResp.json(); // { confirmed: bool, block_height, block_hash }

  // Check one of the outputs pays your address
  const output = tx.vout.find(o => o?.scriptpubkey_address === WALLETS.BTC);
  const paidSats = output ? output.value : 0;

  return {
    paid: !!output,
    amount: paidSats / 1e8, // BTC
    confirmed: !!status.confirmed,
    confs: status.confirmed ? 1 : 0,
    raw: { tx, status }
  };
}

// ---------- ETH (via Etherscan Proxy API) ----------
async function verifyETH(txid) {
  // Use proxy so we get full tx on any provider behind Etherscan
  const key = process.env.ETHERSCAN_API_KEY;
  const u = new URL("https://api.etherscan.io/api");
  u.searchParams.set("module", "proxy");
  u.searchParams.set("action", "eth_getTransactionByHash");
  u.searchParams.set("txhash", txid);
  u.searchParams.set("apikey", key);

  const r = await fetch(u.toString());
  if (!r.ok) throw new Error("ETH API error");
  const data = await r.json();
  const tx = data?.result;

  if (!tx) return { paid: false, reason: "TX not found" };

  const to = (tx.to || "").toLowerCase();
  const valueWei = parseInt(tx.value || "0", 16);
  const valueEth = valueWei / 1e18;

  // Check receipt for success
  const r2u = new URL("https://api.etherscan.io/api");
  r2u.searchParams.set("module", "proxy");
  r2u.searchParams.set("action", "eth_getTransactionReceipt");
  r2u.searchParams.set("txhash", txid);
  r2u.searchParams.set("apikey", key);

  const r2 = await fetch(r2u.toString());
  const recData = await r2.json();
  const receipt = recData?.result;
  const success = receipt?.status === "0x1";

  return {
    paid: to === WALLETS.ETH,
    amount: valueEth,
    confirmed: success,
    confs: success ? 1 : 0,
    raw: { tx, receipt }
  };
}

// ---------- TRON / TRC20 USDT (via TronScan API) ----------
async function verifyTRON_TRXorTRC20(txid) {
  // Public endpoint (fields can evolve): https://apilist.tronscanapi.com/
  const url = `https://apilist.tronscanapi.com/api/transaction-info?hash=${txid}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("TRON API error");
  const tx = await r.json();

  // Success check
  const confirmed = tx.confirmed === true || tx.contractRet === "SUCCESS";

  // Two possibilities:
  // 1) Native TRX transfer → "toAddress" / "ownerAddress"
  // 2) TRC20 token transfer → check token transfer list
  let paid = false;
  let amount = 0;

  // TRC20 logs (most reliable for USDT)
  if (Array.isArray(tx.trc20TransferInfo)) {
    const hit = tx.trc20TransferInfo.find(
      t => (t?.to_address === WALLETS.USDT || t?.toAddress === WALLETS.USDT)
    );
    if (hit) {
      paid = true;
      // amount usually in token decimals (USDT has 6)
      const raw = Number(hit.amount_str || hit.amount || 0);
      amount = raw / 1e6; // assume USDT(6)
    }
  }

  // Fallback (rarely needed for USDT)
  if (!paid && tx.toAddress === WALLETS.USDT) {
    paid = true;
    amount = Number(tx.amount || 0) / 1e6; // TRX has 6 too
  }

  return {
    paid,
    amount,
    confirmed,
    confs: confirmed ? 1 : 0,
    raw: tx
  };
}

// ---------- SOL (via @solana/web3.js) ----------
async function verifySOL(txid) {
  const conn = new Connection(process.env.SOLANA_RPC, "confirmed");
  const sig = txid;
  const parsed = await conn.getParsedTransaction(sig, { maxSupportedTransactionVersion: 0 });
  if (!parsed) return { paid: false, reason: "TX not found" };

  // Look for a SOL transfer to your address
  const myPk = new PublicKey(WALLETS.SOL);
  let lamportsToMe = 0;

  // Sum up postBalances - preBalances for my account
  const index = parsed.transaction.message.accountKeys.findIndex(k => k.pubkey.equals(myPk));
  if (index >= 0) {
    const pre = parsed.meta?.preBalances?.[index] ?? 0;
    const post = parsed.meta?.postBalances?.[index] ?? 0;
    lamportsToMe = post - pre;
  }

  const amountSOL = lamportsToMe / 1e9;
  const confirmed = !!parsed?.slot; // if we got a slot, it's confirmed to that level

  return {
    paid: amountSOL > 0,
    amount: amountSOL,
    confirmed,
    confs: confirmed ? 1 : 0,
    raw: parsed
  };
}

// -------------- Main verify endpoint --------------
app.post("/api/verify-payment", async (req, res) => {
  try {
    const { txid, coin, plan } = req.body || {};
    if (!txid || !coin) return notOk(res, "Missing txid or coin");

    let result;
    if (coin === "BTC") result = await verifyBTC(txid);
    else if (coin === "ETH") result = await verifyETH(txid);
    else if (coin === "USDT") result = await verifyTRON_TRXorTRC20(txid); // TRC20
    else if (coin === "SOL") result = await verifySOL(txid);
    else return notOk(res, "Unsupported coin");

    // Optional: enforce minimum expected amount here if you have it
    // Example if you pass plan.minAmount (number) from frontend:
    // if (result.paid && plan?.minAmount && result.amount < plan.minAmount) {
    //   return notOk(res, "Amount below expected minimum", { chain: result });
    // }

    if (result.paid && result.confirmed) {
      return ok(res, { chain: result });
    } else {
      return notOk(res, "Payment not confirmed yet", { chain: result });
    }
  } catch (e) {
    console.error(e);
    return notOk(res, "Verification error");
  }
});

app.listen(PORT, () => {
  console.log(`✅ CryptoVest backend listening on http://localhost:${PORT}`);
});

// src/pages/Checkout.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState("USDT"); // default
  const [txid, setTxid] = useState("");
  const [copied, setCopied] = useState(false); // ✅ for copy feedback

  // Plan details (from Invest.js)
  const plan = location.state;

  // ✅ Your wallet addresses
  const walletAddresses = {
    BTC: "1J9bGCeb9vbsfBrwy5xGTCUq8Gytfigv54",
    ETH: "0x96ae958a7c672450ef83d07c51629c182869fc13",
    USDT: "TGjBM57ocB34NgMNcSuEfZWWXwcHko6hwv",
    SOL: "7PuTwMcNdGftUXmquSu9YQRZ89SuaPenAsk5WTw195J9",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddresses[selectedCoin]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reset after 2s
  };

  const handleVerify = async () => {
    if (!txid) {
      alert("Please enter your transaction ID.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txid,
          coin: selectedCoin,
          plan, // ✅ pass along plan + amount if custom
        }),
      });

      const data = await res.json();
      if (data.success) {
        navigate("/account", { state: { plan } }); // ✅ send plan to account
      } else {
        alert("Payment not yet detected. Please wait for confirmation.");
      }
    } catch (err) {
      console.error("Error verifying payment:", err);
      alert("Error verifying payment. Try again.");
    }
  };

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-black text-purple-400">
        <p className="text-lg font-semibold">⚠️ Invalid plan. Please go back and select one.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-3 text-purple-500 tracking-wide">
          Checkout — {plan.name}
        </h2>

        {/* ✅ Show custom amount if available */}
        {plan.amount ? (
          <p className="text-purple-300 mb-8 text-lg">
            Amount: <span className="text-white">${plan.amount}</span> • Duration:{" "}
            <span className="text-white">{plan.duration}</span>
          </p>
        ) : (
          <p className="text-purple-300 mb-8 text-lg">
            Range: <span className="text-white">{plan.range}</span> • Duration:{" "}
            <span className="text-white">{plan.duration}</span>
          </p>
        )}

        {/* Select coin */}
        <div className="mb-8">
          <label className="block mb-3 font-semibold text-purple-400">
            Choose Payment Method:
          </label>
          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="w-full p-3 bg-black border-2 border-purple-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="USDT">USDT (TRC20)</option>
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ERC20)</option>
            <option value="SOL">Solana (SOL)</option>
          </select>
        </div>

        {/* Wallet address + QR */}
        <div className="bg-gradient-to-br from-black via-[#0f0f1a] to-black border border-purple-600 rounded-2xl p-6 mb-8 text-center shadow-lg shadow-purple-900/40">
          <p className="mb-3 text-purple-300">
            Send your payment to this {selectedCoin} address:
          </p>
          <p className="font-mono text-purple-400 break-words text-lg mb-4">
            {walletAddresses[selectedCoin]}
          </p>

          {/* ✅ Copy Button */}
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg text-white font-semibold transition-colors"
          >
            {copied ? "✔ Copied!" : "📋 Copy Address"}
          </button>

          <div className="mt-6 flex justify-center">
            <QRCodeCanvas value={walletAddresses[selectedCoin]} size={200} />
          </div>
        </div>

        {/* TXID Input */}
        <input
          type="text"
          placeholder="Enter Transaction ID (TXID/Hash)"
          value={txid}
          onChange={(e) => setTxid(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-lg bg-black border-2 border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Agreement */}
        <label className="flex gap-3 items-center mb-8 text-purple-300">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="w-5 h-5 text-purple-600 border-purple-600 focus:ring-purple-500"
          />
          <span>
            I agree to the <span className="text-purple-500">terms & conditions</span>.
          </span>
        </label>

        {/* Button */}
        <button
          onClick={handleVerify}
          disabled={!agree}
          className={`w-full py-4 rounded-lg font-bold text-lg shadow-md transition-all ${
            agree
              ? "bg-purple-700 hover:bg-purple-800 shadow-purple-900/50 cursor-pointer"
              : "bg-gray-700 cursor-not-allowed"
          }`}
        >
          ✅ I Have Paid
        </button>
      </div>
    </div>
  );
}

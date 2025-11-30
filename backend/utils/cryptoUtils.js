const axios = require('axios');

const ETH_RPC_URL =
  process.env.ETH_RPC_URL || 'https://ethereum.publicnode.com';
const FALLBACK_RPC_URLS = [
  'https://rpc.ankr.com/eth',
  'https://eth.llamarpc.com',
  'https://cloudflare-eth.com'
];
const DEFAULT_USDT_CONTRACT = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const ERC20_TRANSFER_TOPIC =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

console.log('[CryptoUtils] Using ETH RPC URL:', ETH_RPC_URL);

const EXPLORER_APIS = {
  BTC: {
    mainnet: 'https://blockstream.info/api',
    testnet: 'https://blockstream.info/testnet/api',
  },
  SOL: {
    mainnet: 'https://api.mainnet-beta.solana.com',
    testnet: 'https://api.testnet.solana.com',
  },
};

async function callEthRpc(method, params = [], rpcUrl = ETH_RPC_URL) {
  try {
    const response = await axios.post(rpcUrl, {
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }, {
      timeout: 10000 // 10 second timeout
    });

    if (response.data.error) {
      throw new Error(response.data.error.message || 'RPC error');
    }

    return response.data.result;
  } catch (error) {
    // If primary RPC fails, try fallbacks
    if (rpcUrl === ETH_RPC_URL && FALLBACK_RPC_URLS.length > 0) {
      console.log(`[CryptoUtils] Primary RPC failed, trying fallbacks...`);
      for (const fallbackUrl of FALLBACK_RPC_URLS) {
        try {
          console.log(`[CryptoUtils] Trying fallback: ${fallbackUrl}`);
          return await callEthRpc(method, params, fallbackUrl);
        } catch (fallbackError) {
          console.log(`[CryptoUtils] Fallback ${fallbackUrl} failed:`, fallbackError.message);
          continue;
        }
      }
    }
    
    throw new Error(
      `RPC ${method} failed: ${
        error.response?.data?.error?.message || error.message
      }`
    );
  }
}

async function verifyEthTransaction(txHash, expectedAmount, recipientAddress) {
  try {
    const tx = await callEthRpc('eth_getTransactionByHash', [txHash]);
    if (!tx) {
      return { valid: false, error: 'Transaction not found' };
    }

    const txTo = tx.to?.toLowerCase();
    const expectedTo = recipientAddress.toLowerCase();

    if (txTo !== expectedTo) {
      return { valid: false, error: 'Recipient address mismatch' };
    }

    const receipt = await callEthRpc('eth_getTransactionReceipt', [txHash]);
    if (receipt?.status && receipt.status !== '0x1') {
      return { valid: false, error: 'Transaction failed on-chain' };
    }

    const amountInEth = parseInt(tx.value || '0x0', 16) / Math.pow(10, 18);

    return {
      valid: true,
      amount: amountInEth,
      from: tx.from,
      to: tx.to,
    };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

async function verifyUsdtTransaction(txHash, expectedAmount, recipientAddress) {
  const tokenAddress =
    process.env.USDT_CONTRACT_ADDRESS || DEFAULT_USDT_CONTRACT;

  try {
    const receipt = await callEthRpc('eth_getTransactionReceipt', [txHash]);

    if (!receipt) {
      console.error('[verifyUsdtTransaction] Receipt not found');
      return { valid: false, error: 'Transaction receipt not found' };
    }

    const txSucceeded =
      receipt.status === undefined ||
      receipt.status === null ||
      receipt.status === '0x1';

    if (!txSucceeded) {
      return { valid: false, error: 'Transaction failed on-chain' };
    }

    const matchingLogs = (receipt.logs || []).filter(
      (log) =>
        log.topics &&
        log.topics.length >= 3 &&
        log.topics[0]?.toLowerCase() === ERC20_TRANSFER_TOPIC &&
        log.address?.toLowerCase() === tokenAddress.toLowerCase()
    );

    if (!matchingLogs.length) {
      console.error('[verifyUsdtTransaction] No USDT logs found', receipt);
      return { valid: false, error: 'USDT transfer event not found' };
    }

    const normalizedRecipient = recipientAddress.toLowerCase();
    const transferLog =
      matchingLogs.find((log) => {
        const toTopic = log.topics[2];
        const recipient = `0x${toTopic.slice(26)}`.toLowerCase();
        return recipient === normalizedRecipient;
      }) || matchingLogs[0];

    const toTopic = transferLog.topics[2];
    const recipient = `0x${toTopic.slice(26)}`.toLowerCase();

    if (recipient !== normalizedRecipient) {
      console.error(
        '[verifyUsdtTransaction] Recipient mismatch',
        recipient,
        normalizedRecipient
      );
      return { valid: false, error: 'Recipient address mismatch' };
    }

    const amountRaw = parseInt(transferLog.data, 16);
    const amountInUsdt = amountRaw / Math.pow(10, 6);

    if (expectedAmount) {
      const diff = expectedAmount - amountInUsdt;
      if (diff > 0.01) {
        return {
          valid: false,
          error: `Transferred amount (${amountInUsdt}) less than expected (${expectedAmount})`,
        };
      }
    }

    return {
      valid: true,
      amount: amountInUsdt,
      from: `0x${transferLog.topics[1].slice(26)}`,
      to: recipientAddress,
    };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

async function verifyBtcTransaction(txHash, expectedAmount, recipientAddress) {
  try {
    const response = await axios.get(`${EXPLORER_APIS.BTC.mainnet}/tx/${txHash}`);

    if (!response.data) {
      return { valid: false, error: 'Transaction not found' };
    }

    const hasRecipient = response.data.vout.some(
      (output) => output.scriptpubkey_address === recipientAddress
    );

    if (!hasRecipient) {
      return { valid: false, error: 'Recipient address not found in transaction' };
    }

    const totalAmount = response.data.vout
      .filter((output) => output.scriptpubkey_address === recipientAddress)
      .reduce((sum, output) => sum + output.value, 0);

    return {
      valid: true,
      amount: totalAmount,
      confirmations: response.data.status?.block_height ? 1 : 0,
    };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

async function verifySolTransaction(txHash, expectedAmount, recipientAddress) {
  try {
    const response = await axios.post(EXPLORER_APIS.SOL.mainnet, {
      jsonrpc: '2.0',
      id: 1,
      method: 'getTransaction',
      params: [
        txHash,
        {
          encoding: 'jsonParsed',
          maxSupportedTransactionVersion: 0,
        },
      ],
    });

    if (response.data.error) {
      return { valid: false, error: response.data.error.message };
    }

    const tx = response.data.result;
    if (!tx) {
      return { valid: false, error: 'Transaction not found' };
    }

    if (tx.meta?.err) {
      return { valid: false, error: 'Transaction failed' };
    }

    const accountKeys = tx.transaction?.message?.accountKeys || [];
    const hasRecipient = accountKeys.some(
      (key) => key.pubkey === recipientAddress
    );

    if (!hasRecipient) {
      return { valid: false, error: 'Recipient address not found' };
    }

    return {
      valid: true,
      amount: expectedAmount,
      confirmations: tx.slot ? 1 : 0,
    };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

async function verifyTransaction(crypto, txHash, expectedAmount, recipientAddress) {
  switch (crypto.toUpperCase()) {
    case 'ETH':
      return await verifyEthTransaction(txHash, expectedAmount, recipientAddress);
    case 'BTC':
      return await verifyBtcTransaction(txHash, expectedAmount, recipientAddress);
    case 'SOL':
      return await verifySolTransaction(txHash, expectedAmount, recipientAddress);
    case 'USDT':
      return await verifyUsdtTransaction(txHash, expectedAmount, recipientAddress);
    default:
      return { valid: false, error: 'Unsupported cryptocurrency' };
  }
}

module.exports = {
  verifyTransaction,
  EXPLORER_APIS,
  callEthRpc,
};


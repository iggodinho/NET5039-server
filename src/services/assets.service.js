const { getContract } = require('../utils/fabricConnection');

function buildConfig() {
  return {
    channelName: process.env.CHANNEL_NAME,
    chaincodeName: process.env.CHAINCODE_NAME,
    mspId: process.env.MSP_ID,
    keyDirectoryPath: process.env.KEY_DIRECTORY_PATH,
    certDirectoryPath: process.env.CERT_DIRECTORY_PATH,
    tlsCertPath: process.env.TLS_CERT_PATH,
    peerEndpoint: process.env.PEER_ENDPOINT,
    peerHostAlias: process.env.PEER_HOST_ALIAS,
  };
}

async function initLedger() {
  const config = buildConfig();
  const { contract, gateway, client } = await getContract(config);
  try {
    await contract.submitTransaction('InitLedger');
  } finally {
    gateway.close();
    client.close();
  }
}

async function getAllAssets() {
  const config = buildConfig();
  const { contract, gateway, client, utf8Decoder } = await getContract(config);
  try {
    const resultBytes = await contract.evaluateTransaction('GetAllAssets');
    return JSON.parse(utf8Decoder.decode(resultBytes));
  } finally {
    gateway.close();
    client.close();
  }
}

async function createAsset(assetId, color, size, owner, price) {
  const config = buildConfig();
  const { contract, gateway, client } = await getContract(config);
  try {
    await contract.submitTransaction('CreateAsset', assetId, color, size, owner, price);
  } finally {
    gateway.close();
    client.close();
  }
}

async function transferAsset(assetId, newOwner) {
  const config = buildConfig();
  const { contract, gateway, client, utf8Decoder } = await getContract(config);
  try {
    const commit = await contract.submitAsync('TransferAsset', { arguments: [assetId, newOwner] });
    const oldOwner = utf8Decoder.decode(commit.getResult());
    const status = await commit.getStatus();
    if (!status.successful) {
      throw new Error(`Transaction ${status.transactionId} failed with code ${status.code}`);
    }
    return { oldOwner, newOwner };
  } finally {
    gateway.close();
    client.close();
  }
}

async function readAsset(assetId) {
  const config = buildConfig();
  const { contract, gateway, client, utf8Decoder } = await getContract(config);
  try {
    const resultBytes = await contract.evaluateTransaction('ReadAsset', assetId);
    return JSON.parse(utf8Decoder.decode(resultBytes));
  } finally {
    gateway.close();
    client.close();
  }
}

module.exports = {
  initLedger,
  getAllAssets,
  createAsset,
  transferAsset,
  readAsset,
};

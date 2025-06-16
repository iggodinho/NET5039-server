const { getContract } = require('../utils/fabricConnection');
const { TextDecoder } = require('node:util');
const utf8Decoder = new TextDecoder();

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
    contractName: "AccessControl"  // important: use contract name
  };
}

async function createPolicy(policyID, objectsList, role, accessHours = '', objectLocation = '', policyExpiration = '', maxRequestsPerHour = '', notifyOnAccess = '', userLocation = '', allowCloudExport = 'false') {
  const config = buildConfig();
  const { contract, gateway, client } = await getContract(config);
  try {
    const resultBytes = await contract.submitTransaction(
      'CreatePolicy',
      policyID,
      JSON.stringify(objectsList),
      role,
      accessHours,
      objectLocation,
      policyExpiration,
      maxRequestsPerHour,
      notifyOnAccess,
      userLocation,
      allowCloudExport
    );
    return utf8Decoder.decode(resultBytes);
  } finally {
    gateway.close();
    client.close();
  }
}

async function readPolicy(policyID) {
  const config = buildConfig();
  const { contract, gateway, client } = await getContract(config);
  try {
    const resultBytes = await contract.evaluateTransaction('ReadPolicy', policyID);
    return JSON.parse(utf8Decoder.decode(resultBytes));
  } finally {
    gateway.close();
    client.close();
  }
}

async function getAllPolicies() {
  const config = buildConfig();
  const { contract, gateway, client } = await getContract(config);
  try {
    const resultBytes = await contract.evaluateTransaction('GetAllPolicies');
    return JSON.parse(utf8Decoder.decode(resultBytes));
  } finally {
    gateway.close();
    client.close();
  }
}



module.exports = {
  createPolicy,
  readPolicy,
  getAllPolicies,

};

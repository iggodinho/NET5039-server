const { getContract } = require('../utils/fabricConnection'); // o copia de tu fabric.services.js
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

async function registerDevice(objectID, mac, puf, manufacturer, deviceType, firmwareVersion, gatewayID) {
    const config = buildConfig();
    const { contract, gateway, client } = await getContract(config);
    try {
        const resultBytes = await contract.submitTransaction('RegisterDevice', objectID, mac, puf, manufacturer, deviceType, firmwareVersion, gatewayID);
        return JSON.parse(utf8Decoder.decode(resultBytes));
    } finally {
        gateway.close();
        client.close();
    }
}

async function transferOwnership(objectID, newOwner) {
    const config = buildConfig();
    const { contract, gateway, client } = await getContract(config);
    try {
        const resultBytes = await contract.submitTransaction('TransferOwnership', objectID, newOwner);
        return utf8Decoder.decode(resultBytes);
    } finally {
        gateway.close();
        client.close();
    }
}

async function assignController(objectID, controllerID) {
    const config = buildConfig();
    const { contract, gateway, client } = await getContract(config);
    try {
        const resultBytes = await contract.submitTransaction('AssignController', objectID, controllerID);
        return utf8Decoder.decode(resultBytes);
    } finally {
        gateway.close();
        client.close();
    }
}

async function revokeController(objectID, controllerID) {
    const config = buildConfig();
    const { contract, gateway, client } = await getContract(config);
    try {
        const resultBytes = await contract.submitTransaction('RevokeController', objectID, controllerID);
        return utf8Decoder.decode(resultBytes);
    } finally {
        gateway.close();
        client.close();
    }
}

async function readDevice(objectID) {
    const config = buildConfig();
    const { contract, gateway, client } = await getContract(config);
    try {
        const resultBytes = await contract.evaluateTransaction('ReadDevice', objectID);
        return JSON.parse(utf8Decoder.decode(resultBytes));
    } finally {
        gateway.close();
        client.close();
    }
}

async function getAllDevices() {
    const config = buildConfig();
    const { contract, gateway, client, utf8Decoder } = await getContract(config);
    try {
        const resultBytes = await contract.evaluateTransaction('GetAllDevices');
        return JSON.parse(utf8Decoder.decode(resultBytes));
    } finally {
        gateway.close();
        client.close();
    }
}

async function deactivateDevice(objectID) {
    const config = buildConfig();
    const { contract, gateway, client } = await getContract(config);
    try {
        const resultBytes = await contract.submitTransaction('DeleteDevice', objectID);
        return utf8Decoder.decode(resultBytes);
    } finally {
        gateway.close();
        client.close();
    }
}

module.exports = {
  initLedger,
  registerDevice,
  transferOwnership,
  assignController,
  revokeController,
  readDevice,
  getAllDevices,
  deactivateDevice,
};

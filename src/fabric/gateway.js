const fs = require('fs');
const path = require('path');
const { connect, signers } = require('@hyperledger/fabric-gateway');
const config = require('../config/fabricConfig');

function getFirstFileContent(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  if (!files || files.length === 0) {
    throw new Error(`No files found in ${directoryPath}`);
  }
  const filePath = path.join(directoryPath, files[0]);
  return fs.readFileSync(filePath).toString();
}

let gateway;

async function initGateway() {
  console.log(config)
  const cert = getFirstFileContent(config.certDirectoryPath);
  const key = getFirstFileContent(config.keyDirectoryPath);
  const tlsCert = fs.readFileSync(config.tlsCertPath).toString();

  const identity = {
    mspId: config.mspId,
    credentials: cert,
  };
  const signer = signers.newPrivateKeySigner(key);

  const client = await connect({
    identity,
    signer,
    client: {
      connection: {
        address: config.peerEndpoint,
        tlsRootCertificates: tlsCert,
        serverHostOverride: config.peerHostAlias,
      },
    },
  });

  gateway = client;
}

function getContract() {
  const network = gateway.getNetwork(config.channelName);
  return network.getContract(config.chaincodeName);
}

module.exports = { initGateway, getContract };
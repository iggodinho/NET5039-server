const grpc = require('@grpc/grpc-js');
const { connect, hash, signers } = require('@hyperledger/fabric-gateway');
const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const { TextDecoder } = require('node:util');
const utf8Decoder = new TextDecoder();

async function newGrpcConnection(tlsCertPath, peerEndpoint, peerHostAlias) {
  const tlsRootCert = await fs.readFile(tlsCertPath);
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
  return new grpc.Client(peerEndpoint, tlsCredentials, {
    'grpc.ssl_target_name_override': peerHostAlias,
  });
}

async function getFirstDirFileName(dirPath) {
  const files = await fs.readdir(dirPath);
  const file = files[0];
  if (!file) throw new Error(`No files in directory: ${dirPath}`);
  return path.join(dirPath, file);
}

async function newIdentity(certDirectoryPath, mspId) {
  const certPath = await getFirstDirFileName(certDirectoryPath);
  const credentials = await fs.readFile(certPath);
  return { mspId, credentials };
}

async function newSigner(keyDirectoryPath) {
  const keyPath = await getFirstDirFileName(keyDirectoryPath);
  const privateKeyPem = await fs.readFile(keyPath);
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  return signers.newPrivateKeySigner(privateKey);
}

async function getContract({
  channelName,
  chaincodeName,
  mspId,
  keyDirectoryPath,
  certDirectoryPath,
  tlsCertPath,
  peerEndpoint,
  peerHostAlias,
  contractName
}) {
  const client = await newGrpcConnection(tlsCertPath, peerEndpoint, peerHostAlias);
  const gateway = connect({
    client,
    identity: await newIdentity(certDirectoryPath, mspId),
    signer: await newSigner(keyDirectoryPath),
    hash: hash.sha256,
    evaluateOptions: () => ({ deadline: Date.now() + 5000 }),
    endorseOptions: () => ({ deadline: Date.now() + 15000 }),
    submitOptions: () => ({ deadline: Date.now() + 5000 }),
    commitStatusOptions: () => ({ deadline: Date.now() + 60000 }),
  });

  const network = gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName, contractName);

  return { contract, gateway, client, utf8Decoder };
}

module.exports = {
  getContract,
};

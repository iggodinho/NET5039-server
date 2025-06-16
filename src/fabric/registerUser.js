'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');

async function enrollAdmin(wallet, ca) {
  try {
    // Enroll admin user
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: 'Org1MSP',
      type: 'X.509',
    };
    await wallet.put('admin', x509Identity);
    console.log('✅ Successfully enrolled admin user "admin" and imported it into the wallet');
  } catch (error) {
    console.error(`Failed to enroll admin user "admin": ${error}`);
    throw error;
  }
}

async function main() {
  try {
    // Load connection profile
    const ccpPath = path.resolve(__dirname, '..', 'config', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if appUser identity already exists in the wallet
    const userIdentity = await wallet.get('appUser');
    if (userIdentity) {
      console.log('✅ "appUser" identity already exists in the wallet');
      return;
    }

    // Check if admin identity exists, if not enroll admin
    let adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
      console.log('⚠️ "admin" identity not found, enrolling admin...');
      await enrollAdmin(wallet, ca);
      adminIdentity = await wallet.get('admin');
    }

    // Get admin user context
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    // Register the appUser, enroll the appUser, and import the new identity into the wallet.
    const secret = await ca.register({
      affiliation: 'org1.department1',
      enrollmentID: 'appUser',
      role: 'client',
    }, adminUser);

    const enrollment = await ca.enroll({
      enrollmentID: 'appUser',
      enrollmentSecret: secret,
    });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: 'Org1MSP',
      type: 'X.509',
    };

    await wallet.put('appUser', x509Identity);
    console.log('🎉 Successfully registered and enrolled "appUser"');
  } catch (error) {
    console.error(`❌ Failed to register user "appUser": ${error}`);
    process.exit(1);
  }
}

main();

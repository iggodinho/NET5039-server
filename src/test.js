// test.js
require('dotenv').config();
const { initLedger } = require('./services/devices.service');

console.log('Chaincode:', process.env.CHAINCODE_NAME);

initLedger().then(() => {
  console.log('InitLedger success');
}).catch(err => {
  console.error('InitLedger failed:', err);
});

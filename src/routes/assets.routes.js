const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assets.controller');

router.post('/init', assetController.initLedger);
router.get('/', assetController.getAllAssets);
router.post('/', assetController.createAsset);
router.post('/transfer', assetController.transferAsset);
router.get('/:assetId', assetController.readAsset);

module.exports = router;

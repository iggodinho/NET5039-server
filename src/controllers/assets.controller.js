const assetsService = require('../services/assets.service');

async function initLedger(req, res) {
  try {
    await assetsService.initLedger();
    res.status(200).json({ message: 'Ledger initialized' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllAssets(req, res) {
  try {
    const assets = await assetsService.getAllAssets();
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createAsset(req, res) {
  try {
    const { assetId, color, size, owner, price } = req.body;
    if (!assetId || !color || !size || !owner || !price) {
      return res.status(400).json({ error: 'Missing asset fields' });
    }
    await assetsService.createAsset(assetId, color, size, owner, price);
    res.status(201).json({ message: 'Asset created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function transferAsset(req, res) {
  try {
    const { assetId, newOwner } = req.body;
    if (!assetId || !newOwner) {
      return res.status(400).json({ error: 'Missing assetId or newOwner' });
    }
    const result = await assetsService.transferAsset(assetId, newOwner);
    res.status(200).json({ message: 'Asset transferred', ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function readAsset(req, res) {
  try {
    const { assetId } = req.params;
    if (!assetId) {
      return res.status(400).json({ error: 'Missing assetId param' });
    }
    const asset = await assetsService.readAsset(assetId);
    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  initLedger,
  getAllAssets,
  createAsset,
  transferAsset,
  readAsset,
};

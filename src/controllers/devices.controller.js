const deviceService = require('../services/devices.service');

async function initLedger(req, res) {
  try {
    await deviceService.initLedger();
    res.status(200).json({ message: 'Ledger initialized' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function registerDevice(req, res) {
  try {
    console.log(req.body)
    const { objectID, mac, puf, manufacturer, deviceType, firmwareVersion, gatewayID } = req.body;
    const result = await deviceService.registerDevice(objectID, mac, puf, manufacturer, deviceType, firmwareVersion, gatewayID);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function transferOwnership(req, res) {
  try {
    const { newOwner } = req.body;
    const { objectID } = req.params;
    console.log("New owner", newOwner)
    console.log("ObjectId", objectID)
    const result = await deviceService.transferOwnership(objectID, newOwner);
    console.log("Controller: ", result)
    res.status(200).json({ message: result });
  } catch (err) {
    console.log("error", err)
    res.status(500).json({ error: err.message });
  }
}

async function assignController(req, res) {
  try {
    const { controllerID } = req.body;
    const { objectID } = req.params;
    const result = await deviceService.assignController(objectID, controllerID);
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function revokeController(req, res) {
  try {
    const { controllerID } = req.body;
    const { objectID } = req.params;
    const result = await deviceService.revokeController(objectID, controllerID);
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function readDevice(req, res) {
  try {
    const { objectID } = req.params;
    const device = await deviceService.readDevice(objectID);
    res.status(200).json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllDevices(req, res) {
  try {
    const result = await deviceService.getAllDevices();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deactivateDevice(req, res) {
  try {
    const { objectID } = req.params;
    const result = await deviceService.deactivateDevice(objectID);
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

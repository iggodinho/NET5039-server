const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/devices.controller');

router.post('/init', deviceController.initLedger);
router.post('/register', deviceController.registerDevice);
router.post('/:objectID/transfer', deviceController.transferOwnership);
router.post('/:objectID/controller', deviceController.assignController);
router.delete('/:objectID/controller', deviceController.revokeController);
router.get('/', deviceController.getAllDevices);
router.get('/:objectID', deviceController.readDevice);
router.delete('/:objectID', deviceController.deactivateDevice);

module.exports = router;

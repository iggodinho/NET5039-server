const express = require('express');
const router = express.Router();
const policiesController = require('../controllers/policies.controller');

// POST /
router.post('/', policiesController.createPolicy);

// GET /:policyID
router.get('/:policyID', policiesController.readPolicy);

// GET /
router.get('/', policiesController.getAllPolicies);

// DELETE /:policyID
router.delete('/:policyID', policiesController.revokePolicy);

// PUT /:policyID
router.put('/:policyID', policiesController.updatePolicy);

module.exports = router;

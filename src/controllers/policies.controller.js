const policiesService = require('../services/policies.service');

// Create new policy
async function createPolicy(req, res) {
  try {
    const {
      policyID,
      objectsList,
      role,
      accessHours,
      objectLocation,
      policyExpiration,
      maxRequestsPerHour,
      notifyOnAccess,
      userLocation,
      allowCloudExport
    } = req.body;

    const result = await policiesService.createPolicy(
      policyID,
      objectsList,
      role,
      accessHours || '',
      objectLocation || '',
      policyExpiration || '',
      maxRequestsPerHour || '',
      notifyOnAccess || '',
      userLocation || '',
      String(allowCloudExport)
    );

    res.status(201).json({ message: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Read one policy
async function readPolicy(req, res) {
  try {
    const { policyID } = req.params;
    const result = await policiesService.readPolicy(policyID);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all policies
async function getAllPolicies(req, res) {
  try {
    const result = await policiesService.getAllPolicies();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = {
  createPolicy,
  readPolicy,
  getAllPolicies,

};

const express = require('express');
const router = express.Router();
const privacyShieldService = require('../services/privacyShieldService');

// 1. Get entire PrivacyShield dashboard overview
router.get('/overview', (req, res) => {
  res.status(200).json(privacyShieldService.getOverview());
});

// 2. Trigger Canary Secret Leak (Feature 2)
router.post('/trigger-canary', (req, res) => {
  const { token } = req.body || {};
  const result = privacyShieldService.triggerCanaryLeak(token);
  res.status(200).json(result);
});

// 3. Trigger High Entropy Secret Leak (Feature 1)
router.post('/trigger-entropy', (req, res) => {
  const result = privacyShieldService.triggerEntropySecret();
  res.status(200).json(result);
});

// 4. Update Adaptive Privacy Threat Level (Feature 3)
router.post('/threat-level', (req, res) => {
  const { level } = req.body || {};
  const result = privacyShieldService.setThreatLevel(level);
  res.status(200).json(result);
});

// 5. Tamper with Cryptographic Ledger (Feature 4)
router.post('/tamper-ledger', (req, res) => {
  const result = privacyShieldService.tamperLedger();
  res.status(200).json(result);
});

// 6. Reset / Heal Ledger (Feature 4)
router.post('/reset-ledger', (req, res) => {
  const result = privacyShieldService.resetLedger();
  res.status(200).json(result);
});

// 7. Simulate Rogue Collector Fingerprint (Feature 5)
router.post('/simulate-rogue', (req, res) => {
  const result = privacyShieldService.simulateRogueCollector();
  res.status(200).json(result);
});

// 8. Run Policy Simulation Sandbox (Feature 7)
router.post('/simulate-policy', (req, res) => {
  const rules = req.body || {};
  const result = privacyShieldService.runPolicySimulation(rules);
  res.status(200).json(result);
});

// 9. Execute Human Remediation Action (Feature 8)
router.post('/remediate/execute', (req, res) => {
  const { actionId } = req.body || {};
  const result = privacyShieldService.executeRemediation(actionId);
  res.status(200).json(result);
});

// 10. Rollback Remediation Action (Feature 8)
router.post('/remediate/rollback', (req, res) => {
  const { actionId } = req.body || {};
  const result = privacyShieldService.rollbackRemediation(actionId);
  res.status(200).json(result);
});

// 11. Reset All PrivacyShield States
router.post('/reset', (req, res) => {
  const result = privacyShieldService.resetAll();
  res.status(200).json(result);
});

module.exports = router;

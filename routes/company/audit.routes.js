const express = require("express");
const router = express.Router();

const { getAuditLogs } = require("../../controllers/audit.controller");
const { auth } = require("../../middleware/auth.mw");

// GET /company/audit
router.get(
  "/",
  auth,
  getAuditLogs
);

module.exports = router;
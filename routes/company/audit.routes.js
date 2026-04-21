const express = require("express");
const router = express.Router();

const { getAuditLogs } = require("../controllers/audit.controller");
const auth = require("../middlewares/auth.middleware");

// GET /company/audit
router.get(
  "/audit",
  auth,
  getAuditLogs
);

module.exports = router;
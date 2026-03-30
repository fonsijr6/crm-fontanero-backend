const express = require("express");
const router = express.Router();

const auditService = require("../../services/audit.service");
const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");

router.get(
  "/",
  auth,
  requireRole(["owner", "admin"]),
  async (req, res) => {
    try {
      const logs = await auditService.getLogs(req.user.companyId);
      res.json(logs);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
  }
);

module.exports = router;
const express = require("express");
const router = express.Router();

const controller = require("../../controllers/stock.controller");
const { auth } = require("../../middleware/auth.mw");
const { requirePermission } = require("../../middleware/requirePermission");

router.get(
  "/",
  auth,
  requirePermission("stock", "view"),
  controller.getInventory
);

router.post(
  "/adjust",
  auth,
  requirePermission("stock", "edit"),
  controller.adjust // aquí se llama auditService.log() manual
);

module.exports = router;
const express = require("express");
const router = express.Router();

const controller = require("../../controllers/stock.controller");
const { auth } = require("../../middleware/auth.mw");
const { requirePermission } = require("../../middleware/requirePermission");

router.get(
  "/",
  auth,
  requirePermission("stock", "view"),
  controller.getStock
);

router.post(
  "/adjust",
  auth,
  requirePermission("stock", "edit"),
  controller.adjustStock // aquí se llama auditService.log() manual
);

module.exports = router;
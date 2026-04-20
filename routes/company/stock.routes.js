const express = require("express");
const router = express.Router();

const Stock = require("../../models/Stock");
const controller = require("../../controllers/stock.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");
const { requireCompany } = require("../../middleware/requireCompany");
const { requirePermission } = require("../../middleware/requirePermission");

// ✅ Ver inventario (solo materiales)
router.get(
  "/",
  auth,
  requireRole(["owner", "admin", "worker", "viewer"]),
  requirePermission("stock", "view"),
  controller.getInventory
);

// ✅ Ver stock por producto
router.get(
  "/product/:productId",
  auth,
  requireRole(["owner", "admin", "worker", "viewer"]),
  requirePermission("stock", "view"),
  controller.getByProduct
);

// ✅ Ajuste manual de stock
router.put(
  "/:id/adjust",
  auth,
  requireCompany(Stock),
  requireRole(["owner", "admin"]),
  requirePermission("stock", "edit"),
  controller.adjust
);

module.exports = router;

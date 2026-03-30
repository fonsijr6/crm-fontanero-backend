const express = require("express");
const router = express.Router();

const StockItem = require("../../models/StockItem");
const controller = require("../../controllers/stock.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");
const { requireCompany } = require("../../middleware/requireCompany");

// ✅ Ver stock (todos los roles)
router.get(
  "/",
  auth,
  requireRole(["owner", "admin", "worker", "viewer"]),
  controller.getStock
);

// ✅ Crear un ítem de stock (owner, admin)
router.post(
  "/",
  auth,
  requireRole(["owner", "admin"]),
  controller.createStockItem
);

// ✅ Obtener stock por ID
router.get(
  "/:id",
  auth,
  requireCompany(StockItem),
  requireRole(["owner", "admin", "worker", "viewer"]),
  controller.getStockItem
);

// ✅ Actualizar stock (owner, admin)
router.put(
  "/:id",
  auth,
  requireCompany(StockItem),
  requireRole(["owner", "admin"]),
  controller.updateStockItem
);

// ✅ Ajustar cantidad (+ / -)
router.put(
  "/:id/adjust",
  auth,
  requireCompany(StockItem),
  requireRole(["owner", "admin"]),
  controller.adjustStock
);

// ✅ Eliminar stock
router.delete(
  "/:id",
  auth,
  requireCompany(StockItem),
  requireRole(["owner"]),
  controller.deleteStockItem
);

module.exports = router;
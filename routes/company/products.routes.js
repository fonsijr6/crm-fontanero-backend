const express = require("express");
const router = express.Router();

const Product = require("../../models/Product");
const controller = require("../../controllers/product.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");
const { requireCompany } = require("../../middleware/requireCompany");
const { requirePermission } = require("../../middleware/requirePermission");

// ✅ Crear producto (material o servicio)
router.post(
  "/",
  auth,
  requireRole(["owner", "admin"]),
  requirePermission("products", "create"),
  controller.createProduct
);

// ✅ Listar productos activos
router.get(
  "/",
  auth,
  requireRole(["owner", "admin", "worker", "viewer"]),
  requirePermission("products", "view"),
  controller.getProducts
);

// ✅ Obtener producto por ID
router.get(
  "/:id",
  auth,
  requireCompany(Product),
  requireRole(["owner", "admin", "worker", "viewer"]),
  requirePermission("products", "view"),
  controller.getProduct
);

// ✅ Actualizar producto
router.put(
  "/:id",
  auth,
  requireCompany(Product),
  requireRole(["owner", "admin"]),
  requirePermission("products", "edit"),
  controller.updateProduct
);

// ✅ Desactivar producto (NO borrar)
router.put(
  "/:id/deactivate",
  auth,
  requireCompany(Product),
  requireRole(["owner", "admin"]),
  requirePermission("products", "edit"),
  controller.deactivateProduct
);

module.exports = router;
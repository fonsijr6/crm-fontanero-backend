// routes/company/products.routes.js
const express = require("express");
const router = express.Router();

const Product = require("../../models/Product");
const controller = require("../../controllers/product.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");
const { requireCompany } = require("../../middleware/requireCompany");
const { requirePermission } = require("../../middleware/requirePermission");

// Crear producto
router.post(
  "/",
  auth,
  requireRole(["owner", "admin"]),
  requirePermission("products", "create"),
  controller.createProduct
);

// Listar productos
router.get(
  "/",
  auth,
  requireRole(["owner", "admin", "worker", "viewer"]),
  requirePermission("products", "view"),
  controller.getProducts
);

// Ver producto
router.get(
  "/:id",
  auth,
  requireCompany(Product),
  requireRole(["owner", "admin", "worker", "viewer"]),
  requirePermission("products", "view"),
  controller.getProduct
);

// Actualizar producto
router.put(
  "/:id",
  auth,
  requireCompany(Product),
  requireRole(["owner", "admin"]),
  requirePermission("products", "edit"),
  controller.updateProduct
);

// ✅ ELIMINAR PRODUCTO (solo owner)
router.delete(
  "/:id",
  auth,
  requireCompany(Product),
  requireRole(["owner"]),
  requirePermission("products", "delete"),
  controller.deleteProduct
);

module.exports = router;
const express = require("express");
const router = express.Router();

const Product = require("../../models/Product");
const controller = require("../../controllers/product.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");
const { requireCompany } = require("../../middleware/requireCompany");
const { requirePermission } = require("../../middleware/requirePermission");
const { auditAction } = require("../../middleware/auditAction");

// Crear producto
router.post(
  "/",
  auth,
  requireRole(["owner", "admin"]),
  requirePermission("products", "create"),
  auditAction({
    module: "products",
    action: "create",
    getEntityLabel: (req, res) =>
      res.locals.product?.name || req.body.name,
  }),
  controller.createProduct
);

// Listar productos
router.get(
  "/",
  auth,
  requirePermission("products", "view"),
  controller.getProducts
);

// Actualizar producto
router.put(
  "/:id",
  auth,
  requireCompany(Product),
  requirePermission("products", "edit"),
  auditAction({
    module: "products",
    action: "update",
    getEntityLabel: (req, res) =>
      res.locals.product?.name || req.body.name,
  }),
  controller.updateProduct
);

// Eliminar producto
router.delete(
  "/:id",
  auth,
  requireCompany(Product),
  requirePermission("products", "delete"),
  auditAction({
    module: "products",
    action: "delete",
    getEntityLabel: (req, res) =>
      res.locals.product?.name,
  }),
  controller.deleteProduct
);

module.exports = router;
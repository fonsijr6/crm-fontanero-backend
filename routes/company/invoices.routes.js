const express = require("express");
const router = express.Router();

const Invoice = require("../../models/Invoice");
const controller = require("../../controllers/invoice.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");
const { requireCompany } = require("../../middleware/requireCompany");
const { auditAction } = require("../../middleware/auditAction");

// ✅ Crear factura (owner, admin)
router.post(
  "/",
  auth,
  requireRole(["owner", "admin"]),
  auditAction("Crear factura", "invoice"),
  controller.createInvoice
);

// ✅ Listar facturas (todos menos viewer)
router.get(
  "/",
  auth,
  requireRole(["owner", "admin", "worker", "viewer"]),
  controller.getInvoices
);

// ✅ Obtener factura por ID
router.get(
  "/:id",
  auth,
  requireCompany(Invoice),
  requireRole(["owner", "admin", "worker", "viewer"]),
  controller.getInvoice
);

// ✅ Actualizar factura (solo si está draft)
router.put(
  "/:id",
  auth,
  requireCompany(Invoice),
  requireRole(["owner", "admin"]),
  auditAction("Actualizar factura", "invoice"),
  controller.updateInvoice
);

// ✅ Cambiar estado
router.put(
  "/:id/status",
  auth,
  requireCompany(Invoice),
  requireRole(["owner", "admin"]),
  auditAction("Cambiar estado factura", "invoice"),
  controller.updateInvoiceStatus
);

// ✅ Eliminar factura
router.delete(
  "/:id",
  auth,
  requireCompany(Invoice),
  requireRole(["owner"]),
  auditAction("Eliminar factura", "invoice"),
  controller.deleteInvoice
);

module.exports = router;
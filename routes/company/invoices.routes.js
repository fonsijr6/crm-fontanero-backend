const express = require("express");
const router = express.Router();

const Invoice = require("../../models/Invoice");
const controller = require("../../controllers/invoice.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");
const { requireCompany } = require("../../middleware/requireCompany");
const { auditAction } = require("../../middleware/auditAction");
const { requirePermission } = require("../../middleware/requirePermission");

// ✅ Crear factura (owner, admin)
router.post(
  "/",
  auth,
  requireRole(["owner", "admin"]),
  requirePermission("invoices", "create"),
  auditAction("Crear factura", "invoice"),
  controller.createInvoice
);

// ✅ Listar facturas
router.get(
  "/",
  auth,
  requireRole(["owner", "admin", "worker", "viewer"]),
  requirePermission("invoices", "view"),
  controller.getInvoices
);

// ✅ Obtener factura por ID
router.get(
  "/:id",
  auth,
  requireCompany(Invoice),
  requireRole(["owner", "admin", "worker", "viewer"]),
  requirePermission("invoices", "view"),
  controller.getInvoice
);

// ✅ Actualizar factura (SOLO si está draft)
router.put(
  "/:id",
  auth,
  requireCompany(Invoice),
  requireRole(["owner", "admin"]),
  requirePermission("invoices", "edit"),
  auditAction("Actualizar factura", "invoice"),
  controller.updateInvoice
);

// ✅ Cambiar estado de factura (emitir / cancelar)
router.put(
  "/:id/status",
  auth,
  requireCompany(Invoice),
  requireRole(["owner", "admin"]),
  requirePermission("invoices", "edit"),
  auditAction("Cambiar estado factura", "invoice"),
  controller.updateInvoiceStatus
);

module.exports = router;
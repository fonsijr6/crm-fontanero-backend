const express = require("express");
const router = express.Router();

const Invoice = require("../../models/Invoice");
const controller = require("../../controllers/invoice.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireCompany } = require("../../middleware/requireCompany");
const { requirePermission } = require("../../middleware/requirePermission");
const { auditAction } = require("../../middleware/auditAction");

// Crear factura
router.post(
  "/",
  auth,
  requirePermission("invoices", "create"),
  auditAction({
    module: "invoices",
    action: "create",
    getEntityLabel: (req, res) =>
      `Factura ${res.locals.invoice?.invoiceNumber}`,
  }),
  controller.createInvoice
);

// Listar facturas
router.get(
  "/",
  auth,
  requirePermission("invoices", "view"),
  controller.getInvoices
);

// Cambiar estado factura
router.put(
  "/:id/status",
  auth,
  requireCompany(Invoice),
  requirePermission("invoices", "edit"),
  auditAction({
    module: "invoices",
    action: "status_change",
    getEntityLabel: (req, res) =>
      `Factura ${res.locals.invoice?.invoiceNumber}`,
    getMeta: (req, res) => ({
      from: res.locals.prevStatus,
      to: res.locals.invoice?.status,
    }),
  }),
  controller.setStatus
);

module.exports = router;
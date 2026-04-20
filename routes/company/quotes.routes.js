const express = require("express");
const router = express.Router();

const Quote = require("../../models/Quote");
const controller = require("../../controllers/quote.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");
const { requireCompany } = require("../../middleware/requireCompany");
const { requirePermission } = require("../../middleware/requirePermission");

// ✅ Crear presupuesto (draft)
router.post(
  "/",
  auth,
  requireRole(["owner", "admin"]),
  requirePermission("quotes", "create"),
  controller.createQuote
);

// ✅ Listar presupuestos
router.get(
  "/",
  auth,
  requireRole(["owner", "admin", "worker", "viewer"]),
  requirePermission("quotes", "view"),
  controller.getQuotes
);

// ✅ Ver presupuesto
router.get(
  "/:id",
  auth,
  requireCompany(Quote),
  requireRole(["owner", "admin", "worker", "viewer"]),
  requirePermission("quotes", "view"),
  controller.getQuote
);

// ✅ Editar presupuesto (solo si draft)
router.put(
  "/:id",
  auth,
  requireCompany(Quote),
  requireRole(["owner", "admin"]),
  requirePermission("quotes", "edit"),
  controller.updateQuote
);

// ✅ Cambiar estado (accepted / rejected)
router.put(
  "/:id/status",
  auth,
  requireCompany(Quote),
  requireRole(["owner", "admin"]),
  requirePermission("quotes", "edit"),
  controller.updateQuoteStatus
);

// ✅ Convertir presupuesto → factura
router.post(
  "/:id/convert",
  auth,
  requireCompany(Quote),
  requireRole(["owner", "admin"]),
  requirePermission("quotes", "convert"),
  controller.convertQuoteToInvoice
);

module.exports = router;
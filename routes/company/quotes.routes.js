const express = require("express");
const router = express.Router();

const Quote = require("../../models/Quote");
const controller = require("../../controllers/quote.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");
const { requireCompany } = require("../../middleware/requireCompany");
const { requirePermission } = require("../../middleware/requirePermission");

// ✅ Crear presupuesto
router.post(
  "/",
  auth,
  requireRole(["owner", "admin"]),
  requirePermission("quote", "create"),
  controller.createQuote
);

// ✅ Listar presupuestos
router.get(
  "/",
  auth,
  requireRole(["owner", "admin", "worker", "viewer"]),
  requirePermission("quote", "view"),
  controller.getQuotes
);

// ✅ Ver presupuesto
router.get(
  "/:id",
  auth,
  requireCompany(Quote),
  requireRole(["owner", "admin", "worker", "viewer"]),
  requirePermission("quote", "view"),
  controller.getQuote
);

// ✅ Editar presupuesto (solo draft)
router.put(
  "/:id",
  auth,
  requireCompany(Quote),
  requireRole(["owner", "admin"]),
  requirePermission("quote", "edit"),
  controller.updateQuote
);

// ✅ Cambiar estado (accepted / rejected)
router.put(
  "/:id/status",
  auth,
  requireCompany(Quote),
  requireRole(["owner", "admin"]),
  requirePermission("quote", "edit"),
  controller.updateQuoteStatus
);

// ✅ Convertir presupuesto → factura
router.post(
  "/:id/convert",
  auth,
  requireCompany(Quote),
  requireRole(["owner", "admin"]),
  requirePermission("quote", "convert"),
  controller.convertQuoteToInvoice
);

module.exports = router;
``
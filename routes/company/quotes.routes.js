const express = require("express");
const router = express.Router();

const Quote = require("../../models/Quote");
const controller = require("../../controllers/quote.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");
const { requireCompany } = require("../../middleware/requireCompany");

// ✅ Crear presupuesto (owner, admin, worker)
router.post(
  "/",
  auth,
  requireRole(["owner", "admin", "worker"]),
  controller.createQuote
);

// ✅ Listar presupuestos
router.get(
  "/",
  auth,
  requireRole(["owner", "admin", "worker", "viewer"]),
  controller.getQuotes
);

// ✅ Ver presupuesto
router.get(
  "/:id",
  auth,
  requireCompany(Quote),
  requireRole(["owner", "admin", "worker", "viewer"]),
  controller.getQuote
);

// ✅ Editar presupuesto (solo si está pending)
router.put(
  "/:id",
  auth,
  requireCompany(Quote),
  requireRole(["owner", "admin"]),
  controller.updateQuote
);

// ✅ Cambiar estado (aceptado / rechazado)
router.put(
  "/:id/status",
  auth,
  requireCompany(Quote),
  requireRole(["owner", "admin"]),
  controller.updateQuoteStatus
);

// ✅ Convertir presupuesto → factura
router.post(
  "/:id/convert",
  auth,
  requireCompany(Quote),
  requireRole(["owner", "admin"]),
  controller.convertQuoteToInvoice
);

// ✅ Eliminar presupuesto
router.delete(
  "/:id",
  auth,
  requireCompany(Quote),
  requireRole(["owner"]),
  controller.deleteQuote
);

module.exports = router;
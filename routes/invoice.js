const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoice.controller");

// ✅ Todas
router.get("/", invoiceController.getInvoices);

// ✅ Por cliente
router.get("/client/:clientId", invoiceController.getInvoicesByClient);

// ✅ CRUD
router.post("/", invoiceController.createInvoice);
router.get("/:id", invoiceController.getInvoice);
router.put("/:id", invoiceController.updateInvoice);
router.delete("/:id", invoiceController.deleteInvoice);

// ✅ Enviar facturas
router.post("/:id/send", invoiceController.sendInvoiceEmail);

module.exports = router;
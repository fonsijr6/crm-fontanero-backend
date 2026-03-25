const invoiceService = require("../services/invoice.service");

/* ✅ GET ALL DEL USUARIO */
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.findAll(req.user.id);
    res.json(invoices);
  } catch {
    res.status(500).json({ msg: "Error al obtener facturas" });
  }
};

/* ✅ GET POR CLIENTE */
exports.getInvoicesByClient = async (req, res) => {
  try {
    const invoices = await invoiceService.findByClient(
      req.user.id,
      req.params.clientId
    );
    res.json(invoices);
  } catch {
    res.status(500).json({ msg: "Error al obtener facturas del cliente" });
  }
};

/* ✅ GET ONE */
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.findById(req.user.id, req.params.id);
    if (!invoice) return res.status(404).json({ msg: "Factura no encontrada" });

    res.json(invoice);
  } catch {
    res.status(500).json({ msg: "Error al obtener factura" });
  }
};

/* ✅ CREATE */
exports.createInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.create(req.user.id, req.body);
    res.json(invoice);
  } catch {
    res.status(500).json({ msg: "Error al crear factura" });
  }
};

/* ✅ UPDATE */
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.update(
      req.user.id,
      req.params.id,
      req.body
    );

    if (!invoice) return res.status(404).json({ msg: "Factura no encontrada" });
    res.json(invoice);
  } catch {
    res.status(500).json({ msg: "Error al actualizar factura" });
  }
};

/* ✅ DELETE */
exports.deleteInvoice = async (req, res) => {
  try {
    const deleted = await invoiceService.remove(req.user.id, req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Factura no encontrada" });

    res.json({ msg: "Factura eliminada" });
  } catch {
    res.status(500).json({ msg: "Error al eliminar factura" });
  }
};

// ✅ Enviar factura por email
exports.sendInvoiceEmail = async (req, res) => {
  try {
    // ✅ Buscar factura SOLO del usuario autenticado
    const invoice = await invoiceService.findById(req.user.id, req.params.id);

    if (!invoice) {
      return res.status(404).json({ msg: "Factura no encontrada" });
    }

    // ✅ Validación importante
    if (!invoice.clientEmail) {
      return res
        .status(400)
        .json({ msg: "La factura no tiene clientEmail guardado" });
    }

    // ✅ Generar PDF
    const pdfBuffer = await invoiceService.generatePdf(invoice);

    // ✅ Email del cliente (destinatario real)
    const to = invoice.clientEmail;

    // ✅ Reply-To (email del autónomo)
    const replyTo = invoice.issuerEmail;

    // ✅ Enviar email
    await invoiceService.sendEmail({
      to,
      replyTo,
      subject: `Factura ${invoice.invoiceNumber}`,
      pdfBuffer,
      filename: `Factura-${invoice.invoiceNumber}.pdf`,
    });

    // ✅ Cambiar estado a "sent"
    const updated = await invoiceService.update(req.user.id, invoice.id, {
      status: "sent",
    });

    res.json({ success: true, invoice: updated });
  } catch (err) {
    console.error("❌ ERROR AL ENVIAR FACTURA:", err.message, err.stack);
    res.status(500).json({ msg: "Error enviando la factura" });
  }
};
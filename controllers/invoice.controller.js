const invoiceService = require("../services/invoice.service");

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.findAll();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener facturas" });
  }
};

exports.getInvoicesByClient = async (req, res) => {
  try {
    const invoices = await invoiceService.findByClient(req.params.clientId);
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener facturas del cliente" });
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.findById(req.params.id);
    if (!invoice) return res.status(404).json({ msg: "Factura no encontrada" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener factura" });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.create(req.body);
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ msg: "Error al crear factura" });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.update(req.params.id, req.body);
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ msg: "Error al actualizar factura" });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    await invoiceService.remove(req.params.id);
    res.json({ msg: "Factura eliminada" });
  } catch (err) {
    res.status(500).json({ msg: "Error al eliminar factura" });
  }
};

/* ✅ ✅ ENVÍO DE FACTURA POR EMAIL */
exports.sendInvoiceEmail = async (req, res) => {
  try {
    const invoice = await invoiceService.findById(req.params.id);
    if (!invoice) return res.status(404).json({ msg: "Factura no encontrada" });

    // ✅ Validación importante
    if (!invoice.clientEmail) {
      return res.status(400).json({ msg: "La factura no tiene clientEmail guardado" });
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
    const updated = await invoiceService.update(invoice.id, { status: "sent" });

    res.json({ success: true, invoice: updated });

  } catch (err) {
    console.error("❌ ERROR AL ENVIAR FACTURA:", err.message, err.stack);
    res.status(500).json({ msg: "Error enviando la factura" });
  }
};
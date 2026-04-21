const invoiceService = require("../services/invoice.service");

// ✅ Crear factura (draft)
exports.createInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.createInvoice(
      req.user.companyId,
      req.user.userId,
      req.body
    );
    res.locals.invoice = invoice;
    res.json(invoice);
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// ✅ Listar facturas
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.getInvoices(req.user.companyId);
    res.json(invoices);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// ✅ Obtener factura por ID
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoice(
      req.user.companyId,
      req.params.id
    );

    if (!invoice) {
      return res.status(404).json({ msg: "Factura no encontrada" });
    }

    res.json(invoice);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// ✅ Actualizar factura (solo draft)
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.updateInvoice(
      req.user.companyId,
      req.params.id,
      req.body
    );
    res.locals.invoice = invoice;
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// ✅ Cambiar estado de factura
// draft → sent   (consume stock)
// sent → paid    (marca pago)
// sent → cancelled / draft → cancelled
exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ msg: "Estado requerido" });
    }

    const invoice = await invoiceService.updateInvoiceStatus(
      req.user.companyId,
      req.params.id,
      status
    );
    res.locals.invoice = invoice;
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
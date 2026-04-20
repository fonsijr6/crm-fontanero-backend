const quoteService = require("../services/quote.service");

// ✅ Crear presupuesto (draft)
exports.createQuote = async (req, res) => {
  try {
    const quote = await quoteService.createQuote(
      req.user.companyId,
      req.user.userId,
      req.body
    );
    res.status(201).json(quote);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// ✅ Listar presupuestos
exports.getQuotes = async (req, res) => {
  try {
    const quotes = await quoteService.getQuotes(req.user.companyId);
    res.json(quotes);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// ✅ Obtener presupuesto por ID
exports.getQuote = async (req, res) => {
  try {
    const quote = await quoteService.getQuote(
      req.user.companyId,
      req.params.id
    );

    if (!quote) {
      return res.status(404).json({ msg: "Presupuesto no encontrado" });
    }

    res.json(quote);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// ✅ Editar presupuesto (solo si NO está convertido)
exports.updateQuote = async (req, res) => {
  try {
    const quote = await quoteService.updateQuote(
      req.user.companyId,
      req.params.id,
      req.body
    );
    res.json(quote);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// ✅ Cambiar estado → accepted / rejected
exports.updateQuoteStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ msg: "Estado requerido" });
    }

    const quote = await quoteService.updateQuoteStatus(
      req.user.companyId,
      req.params.id,
      status
    );

    res.json(quote);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// ✅ Convertir presupuesto aceptado → factura
exports.convertQuoteToInvoice = async (req, res) => {
  try {
    const invoice = await quoteService.convertToInvoice(
      req.user.companyId,
      req.user.userId,
      req.params.id
    );
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
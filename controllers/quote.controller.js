const quoteService = require("../services/quote.service");

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

exports.getQuotes = async (req, res) => {
  try {
    const quotes = await quoteService.getQuotes(req.user.companyId);
    res.json(quotes);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getQuote = async (req, res) => {
  try {
    const quote = await quoteService.getQuote(
      req.user.companyId,
      req.params.id
    );
    if (!quote) return res.status(404).json({ msg: "Presupuesto no encontrado" });
    res.json(quote);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

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

exports.updateQuoteStatus = async (req, res) => {
  try {
    const updated = await quoteService.updateQuoteStatus(
      req.user.companyId,
      req.params.id,
      req.body.status
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.convertQuoteToInvoice = async (req, res) => {
  try {
    // Esto se implementará cuando generemos el flujo completo
    res.json({ msg: "Función pendiente de implementar" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.deleteQuote = async (req, res) => {
  try {
    await quoteService.deleteQuote(req.user.companyId, req.params.id);
    res.json({ msg: "Presupuesto eliminado correctamente" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
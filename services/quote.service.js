const Quote = require("../models/Quote");
const Company = require("../models/Company");
const Invoice = require("../models/Invoice");
const { generateDocumentNumber } = require("../utils/docNumber");

module.exports = {
  async createQuote(companyId, userId, data) {
    if (!companyId) throw new Error("La empresa es obligatoria.");

    const company = await Company.findById(companyId);
    if (!company) throw new Error("Empresa no encontrada.");

    company.settings.lastQuoteNumber += 1;
    await company.save();

    const quoteNumber = generateDocumentNumber(
      company.settings.quotePrefix,
      company.settings.lastQuoteNumber
    );

    return Quote.create({
      companyId,
      createdBy: userId,
      quoteNumber,
      status: "draft",
      client: data.client ?? data.clientId,
      ...data,
    });
  },

  async getQuotes(companyId) {
    return Quote.find({ companyId })
      .sort({ createdAt: -1 })
      .populate("client", "name email");
  },

  async getQuote(companyId, quoteId) {
    return Quote.findOne({ _id: quoteId, companyId })
      .populate("client", "name email")
      .populate("items.productId", "name unit");
  },

  async updateQuote(companyId, quoteId, data) {
    const quote = await Quote.findOne({ _id: quoteId, companyId });
    if (!quote) throw new Error("Presupuesto no encontrado.");

    if (quote.status === "converted") {
      throw new Error("No se puede modificar un presupuesto convertido.");
    }

    if (data.items && data.items.length > 100) {
      throw new Error("No puedes añadir más de 100 líneas.");
    }

    if (data.clientId) {
      data.client = data.clientId;
      delete data.clientId;
    }

    Object.assign(quote, data);
    await quote.save();

    return quote;
  },

  async updateQuoteStatus(companyId, quoteId, status) {
    const quote = await Quote.findOne({ _id: quoteId, companyId });
    if (!quote) throw new Error("Presupuesto no encontrado.");

    if (!["accepted", "rejected"].includes(status)) {
      throw new Error("Estado no válido.");
    }

    if (quote.status === "converted") {
      throw new Error("No se puede cambiar el estado tras convertir.");
    }

    quote.status = status;
    await quote.save();

    return quote;
  },

  async convertToInvoice(companyId, userId, quoteId) {
    const quote = await Quote.findOne({ _id: quoteId, companyId });
    if (!quote) throw new Error("Presupuesto no encontrado.");

    if (quote.status !== "accepted") {
      throw new Error("Solo se puede convertir un presupuesto aceptado.");
    }

    const company = await Company.findById(companyId);
    company.settings.lastInvoiceNumber += 1;
    await company.save();

    const invoiceNumber = generateDocumentNumber(
      company.settings.invoicePrefix,
      company.settings.lastInvoiceNumber
    );

    const invoice = await Invoice.create({
      companyId,
      createdBy: userId,
      invoiceNumber,
      client: quote.client,
      items: quote.items,
      status: "draft",
      quoteId: quote._id,
      subtotal: quote.subtotal,
      taxTotal: quote.taxTotal,
      total: quote.total,
    });

    quote.status = "converted";
    quote.invoiceId = invoice._id;
    await quote.save();

    return invoice;
  },
};
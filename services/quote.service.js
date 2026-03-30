const Quote = require("../models/Quote");

module.exports = {
  
async createQuote(companyId, userId, data) {
    if (!companyId) throw new Error("La empresa es obligatoria.");

    const company = await Company.findById(companyId);
    if (!company) throw new Error("Empresa no encontrada.");

    // ✅ Incrementar contador
    company.settings.lastQuoteNumber += 1;
    await company.save();

    // ✅ Generar numeración profesional
    const quoteNumber = generateDocumentNumber(
      company.settings.quotePrefix,
      company.settings.lastQuoteNumber
    );

    return await Quote.create({
      companyId,
      createdBy: userId,
      quoteNumber,
      ...data,
    });
  },

  async getQuotes(companyId) {
    return await Quote.find({ companyId }).sort({ createdAt: -1 });
  },

  async updateQuote(companyId, quoteId, data) {
    if (data.items && data.items.length > 100)
      throw new Error("No puedes añadir más de 100 líneas.");

    return await Quote.findOneAndUpdate(
      { _id: quoteId, companyId },
      data,
      { new: true }
    );
  },

  async updateQuoteStatus(companyId, quoteId, status) {
    return await Quote.findOneAndUpdate(
      { _id: quoteId, companyId },
      { status },
      { new: true }
    );
  },
};
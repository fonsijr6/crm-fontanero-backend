const Invoice = require("../models/Invoice");

module.exports = {
  
async createInvoice(companyId, userId, data) {
    if (!companyId) throw new Error("La empresa es obligatoria.");

    const company = await Company.findById(companyId);
    if (!company) throw new Error("Empresa no encontrada.");

    // ✅ Incrementar el contador
    company.settings.lastInvoiceNumber += 1;
    await company.save();

    // ✅ Generar número profesional
    const invoiceNumber = generateDocumentNumber(
      company.settings.invoicePrefix,
      company.settings.lastInvoiceNumber
    );

    // ✅ Crear factura con numeración automática
    return await Invoice.create({
      companyId,
      createdBy: userId,
      invoiceNumber,
      ...data,
    });
  },
  
  async getInvoices(companyId) {
    return await Invoice.find({ companyId }).sort({ createdAt: -1 });
  },

  async updateInvoice(companyId, invoiceId, data) {
    return await Invoice.findOneAndUpdate(
      { _id: invoiceId, companyId },
      data,
      { new: true }
    );
  },

  async updateInvoiceStatus(companyId, invoiceId, status) {
    return await Invoice.findOneAndUpdate(
      { _id: invoiceId, companyId },
      { status },
      { new: true }
    );
  },
};
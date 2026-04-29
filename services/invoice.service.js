const Invoice = require("../models/Invoice");
const Company = require("../models/Company");
const stockService = require("./stock.service");
const { generateDocumentNumber } = require("../utils/docNumber");

module.exports = {
  async createInvoice(companyId, userId, data) {
    if (!companyId) throw new Error("La empresa es obligatoria.");

    const company = await Company.findById(companyId);
    if (!company) throw new Error("Empresa no encontrada.");

    company.settings.lastInvoiceNumber += 1;
    await company.save();

    const invoiceNumber = generateDocumentNumber(
      company.settings.invoicePrefix,
      company.settings.lastInvoiceNumber
    );

    return Invoice.create({
      companyId,
      createdBy: userId,
      invoiceNumber,
      status: "draft",
      client: data.client ?? data.clientId,
      ...data,
    });
  },

  async getInvoices(companyId) {
    return Invoice.find({ companyId })
      .sort({ createdAt: -1 })
      .populate("client", "name email");
  },

  async getInvoice(companyId, invoiceId) {
    return Invoice.findOne({ _id: invoiceId, companyId })
      .populate("client", "name email")
      .populate("items.productId", "name unit");
  },

  async updateInvoice(companyId, invoiceId, data) {
    if (data.clientId) {
      data.client = data.clientId;
      delete data.clientId;
    }

    const invoice = await Invoice.findOne({ _id: invoiceId, companyId });
    if (!invoice) throw new Error("Factura no encontrada.");

    if (invoice.status !== "draft") {
      throw new Error("Solo se pueden modificar facturas en borrador.");
    }

    Object.assign(invoice, data);
    await invoice.save();
    return invoice;
  },

  async updateInvoiceStatus(companyId, invoiceId, newStatus) {
    const invoice = await Invoice.findOne({ _id: invoiceId, companyId });
    if (!invoice) throw new Error("Factura no encontrada.");

    if (invoice.status === "draft" && newStatus === "sent") {
      for (const item of invoice.items) {
        if (item.productType === "material") {
          await stockService.adjust(
            companyId,
            item.productId,
            -item.quantity
          );
        }
      }
    }

    if (newStatus === "paid") {
      invoice.paidAt = new Date();
    }

    invoice.status = newStatus;
    await invoice.save();
    return invoice;
  },
};

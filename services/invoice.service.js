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

    return await Invoice.create({
      companyId,
      createdBy: userId,
      invoiceNumber,
      status: "draft",
      ...data,
    });
  },

  async updateInvoice(companyId, invoiceId, data) {
    const invoice = await Invoice.findOne({ _id: invoiceId, companyId });
    if (!invoice) throw new Error("Factura no encontrada.");

    if (invoice.status !== "draft") {
      throw new Error("Solo se pueden modificar facturas en borrador.");
    }

    Object.assign(invoice, data);
    await invoice.save();

    return invoice;
  },

  // 🔥 CAMBIO DE ESTADO CON CONSUMO DE STOCK
  async updateInvoiceStatus(companyId, invoiceId, newStatus) {
    const invoice = await Invoice.findOne({ _id: invoiceId, companyId });
    if (!invoice) throw new Error("Factura no encontrada.");

    const allowed = ["draft", "sent", "paid", "cancelled"];
    if (!allowed.includes(newStatus)) {
      throw new Error("Estado de factura no válido.");
    }

    // ❌ No volver atrás
    if (invoice.status === "sent" && newStatus === "draft") {
      throw new Error("No se puede volver a borrador una factura emitida.");
    }

    // 🔥 CONSUMIR STOCK AL EMITIR
    if (invoice.status === "draft" && newStatus === "sent") {
      for (const item of invoice.items) {
        if (item.productType === "material") {
          // cantidad negativa = consumo
          await stockService.adjust(
            companyId,
            item.productId,
            -item.quantity
          );
        }
      }
    }

    // ✅ Marcar como pagada
    if (newStatus === "paid") {
      invoice.paidAt = new Date();
    }

    invoice.status = newStatus;
    await invoice.save();

    return invoice;
  },

  async getInvoices(companyId) {
    return await Invoice.find({ companyId }).sort({ createdAt: -1 });
  },

  async getInvoice(companyId, invoiceId) {
    return await Invoice.findOne({ _id: invoiceId, companyId });
  }
};

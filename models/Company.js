const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    legalName: { type: String, default: "" },
    companyNif: { type: String, required: true },
    fiscalAddress: { type: String, default: "" },
    companyEmail: { type: String, default: "" },
    companyPhone: { type: String, default: "" },

    modulesEnabled: {
      type: [String],
      default: ["clients", "tasks", "invoices", "quotes", "products", "stock"]
    },

    settings: {
      invoicePrefix: { type: String, default: "FAC-" },
      quotePrefix:   { type: String, default: "PRES-" },
      taskPrefix:    { type: String, default: "TSK-" },
      lastInvoiceNumber: { type: Number, default: 0 },
      lastQuoteNumber:   { type: Number, default: 0 },
      lastTaskNumber:    { type: Number, default: 0 }
    },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Company || mongoose.model("Company", companySchema);
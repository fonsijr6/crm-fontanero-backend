const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    // 🌐 Nombre comercial de la empresa
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // 🧾 Razón social (si existe)
    legalName: {
      type: String,
      default: "",
      trim: true,
    },

    // 🔢 Identificador fiscal (NIF/CIF/VAT)
    companyNif: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // 🏛 Dirección fiscal
    fiscalAddress: {
      type: String,
      default: "",
      trim: true,
    },

    // 📧 Email oficial / facturación de la empresa
    companyEmail: {
      type: String,
      default: "",
      trim: true,
    },

    // 📞 Teléfono de la empresa
    companyPhone: {
      type: String,
      default: "",
      trim: true,
    },

    // 🖼 Logo de la empresa (Cloudinary)
    logoUrl: {
      type: String,
      default: "",
    },

    // 👑 Usuario propietario (quien paga la licencia)
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Módulos habilitados en esta empresa (para monetización futura)
    modulesEnabled: {
      type: [String],
      default: ["clients", "tasks", "invoices", "quotes"],
    },

    // 🌍 Preferencias de país y fiscalidad
    country: {
      type: String,
      default: "ES",   // España por defecto
    },

    currency: {
      type: String,
      default: "EUR",
    },

    taxRateDefault: {
      type: Number,
      default: 21, // IVA estándar en España
    },

    // 🧩 Preferencias avanzadas (se pueden ampliar en el futuro)
    settings: {
      invoicePrefix: { type: String, default: "FAC-" },
      quotePrefix: { type: String, default: "PRES-" },
      taskPrefix: { type: String, default: "TSK-" },

      lastInvoiceNumber: { type: Number, default: 0 },
      lastQuoteNumber: { type: Number, default: 0 },
      lastTaskNumber: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
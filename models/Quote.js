const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    // ✅ Multi-empresa
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    // ✅ Cliente al que va dirigido
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // ✅ Quién creó el presupuesto
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Número del presupuesto (PRES-001, etc.)
    quoteNumber: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ Fecha de creación
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // ✅ Validez (por ejemplo 30 días)
    validUntil: {
      type: Date,
      default: null,
    },

    // ✅ Líneas del presupuesto
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },      // copia del nombre del producto
        description: { type: String, default: "" },  // copia opcional
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, required: true },
        taxRate: { type: Number, default: 21 },
        total: { type: Number, required: true },     // calculado
      },
    ],

    // ✅ Totales
    subtotal: {
      type: Number,
      required: true,
    },

    taxTotal: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    // ✅ Estado del presupuesto
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    // ✅ Si se convierte en factura
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      default: null,
    },

    // ✅ URL de PDF (si decides generarlo)
    pdfUrl: {
      type: String,
      default: "",
    },

    // ✅ Notas internas
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quote", quoteSchema);
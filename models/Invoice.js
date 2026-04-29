const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    // ✅ Multi-empresa: cada factura pertenece a una empresa
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    // ✅ Cliente al que se factura
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // ✅ Usuario que creó la factura
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Número de factura (p. ej. FAC-2026-001)
    invoiceNumber: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ Fecha de emisión
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // ✅ Fecha de vencimiento
    dueDate: {
      type: Date,
      default: null,
    },

    // ✅ Líneas de la factura (productos/servicios)
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },      // copia del nombre del producto
        description: { type: String, default: "" },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
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

    // ✅ Estado de la factura
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "cancelled"],
      default: "draft",
    },

    // ✅ Relación con Presupuesto, si viene de uno
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
      default: null,
    },

    // ✅ PDF generado (Cloudinary, S3, etc.)
    pdfUrl: {
      type: String,
      default: "",
    },

    // ✅ Notas internas
    notes: {
      type: String,
      default: "",
    },

    // ✅ Método de pago para análisis
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer", "online", "other"],
      default: "transfer",
    },

    // ✅ Fecha de pago si está pagada
    paidAt: {
      type: Date,
      default: null,
    },

    // ✅ Auditoría
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
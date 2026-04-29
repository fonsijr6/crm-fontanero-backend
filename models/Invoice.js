const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // ✅ Snapshot del producto en el momento de facturar
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    productType: {
      type: String,
      enum: ["material", "service"],
      required: true,
    },

    unit: {
      type: String,
      required: true, // unidad, hora, metro...
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    taxRate: {
      type: Number,
      default: 21,
    },

    total: {
      type: Number,
      required: true, // calculado
    },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    items: {
      type: [invoiceItemSchema],
      required: true,
      minlength: 1,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    taxTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["draft", "sent", "paid", "cancelled"],
      default: "draft",
      index: true,
    },

    // ✅ Relación con presupuesto
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
      default: null,
    },

    pdfUrl: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer", "online", "other"],
      default: "transfer",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
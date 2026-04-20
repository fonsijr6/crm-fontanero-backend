const mongoose = require("mongoose");

const quoteItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // ✅ Snapshot del producto
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

    unitPrice: {
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

const quoteSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    quoteNumber: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    validUntil: {
      type: Date,
      default: null,
    },

    items: {
      type: [quoteItemSchema],
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
      enum: ["draft", "accepted", "rejected", "converted"],
      default: "draft",
      index: true,
    },

    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quote", quoteSchema);
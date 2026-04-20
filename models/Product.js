const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // 🔑 CLAVE: tipo de producto
    type: {
      type: String,
      enum: ["material", "service"],
      required: true,
    },

    // ✅ Precio base (servicio o material)
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    taxRate: {
      type: Number,
      default: 21,
    },

    unit: {
      type: String,
      default: "unidad", // unidad, hora, metro, kg...
    },

    sku: {
      type: String,
      trim: true,
      default: "",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true, // ✅ un producto solo tiene un stock
    },

    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    minStock: {
      type: Number,
      default: 0,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    lastMovementNote: {
      type: String,
      trim: true,
      default: "",
    },

    lastMovementAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stock", stockSchema);
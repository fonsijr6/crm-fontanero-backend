const mongoose = require("mongoose");

const stockItemSchema = new mongoose.Schema(
  {
    // ✅ Multi-empresa
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    // ✅ Producto al que pertenece este stock
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // ✅ Cantidad actual del stock
    quantity: {
      type: Number,
      default: 0,
    },

    // ✅ Mínimo aceptable (alerta)
    minStock: {
      type: Number,
      default: 0,
    },

    // ✅ Auditoría básica
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ✅ Opcional: motivo o descripción del último movimiento
    lastMovementNote: {
      type: String,
      trim: true,
      default: "",
    },

    // ✅ Opcional: Fecha del último movimiento
    lastMovementAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockItem", stockItemSchema);
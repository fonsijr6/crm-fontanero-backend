const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // ✅ A qué empresa pertenece este producto
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    // ✅ Nombre del producto o servicio
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ Descripción opcional
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // ✅ Tipo: Producto físico o servicio
    type: {
      type: String,
      enum: ["product", "service"],
      default: "product",
    },

    // ✅ Precio unitario
    price: {
      type: Number,
      required: true,
      default: 0,
    },

    // ✅ Impuesto (IVA)
    taxRate: {
      type: Number,
      required: true,
      default: 21,
    },

    // ✅ Unidad de medida (opcional)
    unit: {
      type: String,
      default: "unidad", // unidad, hora, metro, pack…
    },

    // ✅ SKU o referencia interna
    sku: {
      type: String,
      trim: true,
      default: "",
    },

    // ✅ Si quieres enlazar con stock
    stockQuantity: {
      type: Number,
      default: 0,
    },

    // ✅ Umbral para avisos de stock bajo
    stockAlertThreshold: {
      type: Number,
      default: 0,
    },

    // ✅ Imagen opcional del producto
    imageUrl: {
      type: String,
      default: "",
    },

    // ✅ Activo / desactivado (no borrar productos antiguos)
    isActive: {
      type: Boolean,
      default: true,
    },

    // ✅ Auditoría
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
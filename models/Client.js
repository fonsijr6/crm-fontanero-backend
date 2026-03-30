const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    // 🏢 A qué empresa pertenece este cliente
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    // ✅ Información básica del cliente
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    // 🏠 Dirección del cliente (muy útil para tareas)
    address: {
      type: String,
      trim: true,
      default: "",
    },

    // 🧾 Información fiscal del cliente (para facturas)
    clientNif: {
      type: String,
      trim: true,
      default: "",
    },

    // 📝 Notas internas
    notes: {
      type: String,
      trim: true,
      default: "",
    },

    // 📂 Etiquetas (para clasificar clientes)
    tags: {
      type: [String],
      default: [],
    },

    // 📸 Fotos opcionales del cliente (fachada, ubicación…)
    images: {
      type: [String],
      default: [],
    },

    // 👤 Auditoría básica
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

module.exports = mongoose.model("Client", clientSchema);
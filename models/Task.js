const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // ✅ Multi-empresa: cada tarea pertenece a 1 empresa
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    // ✅ Cliente asociado a la tarea
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // ✅ Usuario asignado (técnico/empleado)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Puede crearse sin asignar y asignarse después
    },

    // ✅ Usuario que creó la tarea
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Descripción corta del aviso
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ Detalle opcional
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // 📅 Fecha de la intervención
    date: {
      type: Date,
      required: true,
    },

    // 🕒 Hora de la intervención (string es suficiente)
    time: {
      type: String,
      default: "",
    },

    // 📍 Dirección (por si el cliente tiene varias)
    address: {
      type: String,
      trim: true,
      default: "",
    },

    // 🖼 Fotos del trabajo (Cloudinary URLs)
    images: {
      type: [String],
      default: [],
    },

    // 🏷 Estado de la tarea
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },

    // ✅ Nivel de prioridad
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // ✅ ¿Fue la tarea facturada ya?
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      default: null,
    },

    // ✅ Notas internas del técnico
    technicianNotes: {
      type: String,
      trim: true,
      default: "",
    },

    // ✅ Firma del cliente (en el futuro)
    clientSignatureUrl: {
      type: String,
      default: "",
    },

    // ✅ Ubicación GPS opcional
    gpsLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
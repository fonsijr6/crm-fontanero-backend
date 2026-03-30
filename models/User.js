const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // 🔐 A qué empresa pertenece este usuario
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    // 👤 Identidad básica
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,  // ✅ seguridad: no se devuelve por defecto
    },

    // 🛂 Rol dentro de la empresa
    role: {
      type: String,
      enum: ["superadmin","owner", "admin", "worker", "viewer"],
      default: "worker",
    },

    // ✅ Datos opcionales de perfil (útiles para notificaciones, tareas, etc.)
    phone: {
      type: String,
      trim: true,
      default: "",
    },

    avatarUrl: {
      type: String,
      trim: true,
      default: "",
    },

    // ✅ Estado del usuario (para suspender empleados sin borrarlos)
    isActive: {
      type: Boolean,
      default: true,
    },

    // ✅ Última vez que inició sesión (útil en SaaS)
    lastLoginAt: {
      type: Date,
      default: null,
    },

    // ✅ Opcional: notificaciones o preferencias del usuario
    preferences: {
      theme: { type: String, default: "system" },
      language: { type: String, default: "es" },
    },
    permissions: {
      clients: {
        view: { type: Boolean, default: true },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      },
      tasks: {
        view: { type: Boolean, default: true },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        assign: { type: Boolean, default: false },
        complete: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      },
      invoices: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
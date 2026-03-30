const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    // ✅ Multi-empresa (importantísimo)
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },

    // ✅ Usuario dueño de esta sesión
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ✅ Refresh Token HASH (nunca guardamos token plano)
    refreshTokenHash: {
      type: String,
      required: true
    },

    // ✅ Versión del refresh token para rotación segura
    refreshVersion: {
      type: Number,
      default: 1
    },

    // ✅ Datos del dispositivo
    deviceName: {
      type: String,
      default: "unknown",
      maxlength: 80
    },

    userAgent: {
      type: String,
      default: "",
      maxlength: 300
    },

    ip: {
      type: String,
      default: ""
    },

    // ✅ Fecha de expiración del refresh token
    expiresAt: {
      type: Date,
      required: true
    },

    // ✅ Permite invalidar una sola sesión sin afectar el resto
    revoked: {
      type: Boolean,
      default: false
    },

    // ✅ Registro de actividad
    lastActivityAt: {
      type: Date,
      default: null
    },

    lastRefreshAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
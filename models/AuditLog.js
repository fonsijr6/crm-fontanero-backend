const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    action: { 
      type: String, 
      required: true,
      maxlength: 200 
    },

    module: { // clients, invoices, tasks…
      type: String,
      required: true,
      maxlength: 50
    },

    entityId: { 
      type: String, 
      default: null 
    },

    ip: { type: String },          // IP del usuario
    userAgent: { type: String },   // Navegador / móvil

  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
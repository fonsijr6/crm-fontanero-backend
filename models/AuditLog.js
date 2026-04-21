const auditLogSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    module: {
      type: String, // clients, products, stock, invoices, tasks
      required: true,
      index: true,
      maxlength: 50,
    },

    action: {
      type: String, // create, update, delete, adjust, status_change
      required: true,
      index: true,
      maxlength: 100,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    // ✅ NUEVO: texto legible
    entityLabel: {
      type: String,
      maxlength: 200,
    },

    // ✅ NUEVO: info del cambio
    meta: {
      type: mongoose.Schema.Types.Mixed,
    },

    ip: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);
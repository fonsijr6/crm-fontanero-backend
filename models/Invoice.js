const mongoose = require("mongoose");

const invoiceLineSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  taxRate: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema(
  {
    /* ✅ MULTI-USUARIO REAL */
    userId: { type: String, required: true },

    invoiceNumber: { type: String, required: true, unique: true },

    clientId: { type: String, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, default: "" },
    clientAddress: { type: String, default: "" },
    clientNif: { type: String, default: "" },

    issuerName: { type: String, required: true },
    issuerNif: { type: String, default: "" },
    issuerEmail: { type: String },
    issuerAddress: { type: String, default: "" },

    date: { type: Date, required: true },
    dueDate: { type: Date },

    lines: [invoiceLineSchema],

    notes: { type: String, default: "" },

    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue"],
      default: "draft",
    },

    subtotal: { type: Number, required: true },
    taxTotal: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

invoiceSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject({ virtuals: true });
  object.id = _id;
  return object;
});

module.exports = mongoose.model("Invoice", invoiceSchema);
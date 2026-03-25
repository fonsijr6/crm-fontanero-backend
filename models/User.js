const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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
      select: false,
    },

    // ✅ Dirección fiscal del autónomo
    issuerAddress: {
      type: String,
      default: "",
      trim: true,
    },

    // ✅ NIF / CIF del autónomo
    issuerNif: {
      type: String,
      default: "",
      trim: true,
    },

    // ✅ Email del autónomo (para Reply-To en facturas)
    issuerEmail: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
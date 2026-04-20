const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: ["owner", "admin", "worker", "viewer"],
      default: "worker"
    },

    permissions: {
      type: Object,
      default: {
        clients:  { view: true, create: false, edit: false, delete: false },
        tasks:    { view: true, create: false, edit: false, delete: false },
        products: { view: true, create: false, edit: false, delete: false },
        stock:    { view: true, edit: false },
        users:    { view: false, create: false, edit: false, delete: false }
      }
    },

    isActive: { type: Boolean, default: true },

    loginAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    lockedUntil: { type: Date, default: null },

    lastLoginAt: { type: Date, default: null },
    lastActivityAt: { type: Date, default: null },

    mustChangePassword: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
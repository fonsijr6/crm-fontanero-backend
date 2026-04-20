const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      index: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: ["owner", "admin", "worker", "viewer"],
      default: "worker",
      index: true
    },

    permissions: {
      type: Object,
      default: {}
    },

    isActive: {
      type: Boolean,
      default: true
    },

    loginAttempts: {
      type: Number,
      default: 0
    },

    isLocked: {
      type: Boolean,
      default: false
    },

    lockedUntil: {
      type: Date,
      default: null
    },

    lastLoginAt: {
      type: Date,
      default: null
    },

    lastActivityAt: {
      type: Date,
      default: null
    },

    mustChangePassword: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Email único por empresa
userSchema.index({ companyId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
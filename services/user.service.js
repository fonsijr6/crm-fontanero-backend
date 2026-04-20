const User = require("../models/User");
const bcrypt = require("bcryptjs");

const DEFAULT_PERMISSIONS = {
  owner: {
    clients:  { view: true, create: true, edit: true, delete: true },
    tasks:    { view: true, create: true, edit: true, delete: true },
    products: { view: true, create: true, edit: true, delete: true },
    stock:    { view: true, edit: true },
    quotes:   { view: true, create: true, edit: true, convert: true },
    invoices: { view: true, create: true, edit: true }
  },
  admin: {
    clients:  { view: true, create: true, edit: true, delete: false },
    tasks:    { view: true, create: true, edit: true, delete: false },
    products: { view: true, create: true, edit: true, delete: false },
    stock:    { view: true, edit: true },
    quotes:   { view: true, create: true, edit: true, convert: false },
    invoices: { view: true, create: true, edit: true }
  },
  worker: {
    clients:  { view: true, create: false, edit: false, delete: false },
    tasks:    { view: true, create: true, edit: true, delete: false },
    products: { view: true, create: false, edit: false, delete: false },
    stock:    { view: true, edit: false },
    quotes:   { view: true, create: false, edit: false, convert: false },
    invoices: { view: true, create: false, edit: false }
  },
  viewer: {
    clients:  { view: true },
    tasks:    { view: true },
    products: { view: true },
    stock:    { view: true },
    quotes:   { view: true },
    invoices: { view: true }
  }
};

module.exports = {
  async createUser({ companyId, name, email, password, role }) {
    if (!companyId) throw new Error("Empresa obligatoria");
    if (!name?.trim()) throw new Error("Nombre obligatorio");
    if (!email) throw new Error("Email obligatorio");
    if (!password || password.length < 6)
      throw new Error("Contraseña mínima 6 caracteres");

    const hashed = await bcrypt.hash(password, 10);

    return await User.create({
      companyId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role,
      permissions: DEFAULT_PERMISSIONS[role]
    });
  },

  async getUsers(companyId) {
    return await User.find({ companyId }).select("-password");
  },

  async getUserById(companyId, userId) {
    return await User.findOne({ _id: userId, companyId }).select("-password");
  },

  async updateUser(companyId, userId, data) {
    if (data.name && data.name.length > 80)
      throw new Error("Nombre demasiado largo");

    return await User.findOneAndUpdate(
      { _id: userId, companyId },
      data,
      { new: true, runValidators: true }
    ).select("-password");
  },

  async updatePermissions(companyId, userId, permissions) {
    return await User.findOneAndUpdate(
      { _id: userId, companyId },
      { permissions },
      { new: true }
    ).select("-password");
  },

  async deactivateUser(companyId, userId) {
    return await User.findOneAndUpdate(
      { _id: userId, companyId },
      { isActive: false },
      { new: true }
    ).select("-password");
  },

  async deleteUser(companyId, userId) {
    return await User.deleteOne({ _id: userId, companyId });
  }
};

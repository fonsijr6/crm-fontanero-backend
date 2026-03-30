const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = {
  // ✅ Crear usuario (empleado u owner)
  async createUser({ companyId, name, email, password, role }) {
    if (!companyId) throw new Error("La empresa es obligatoria.");
    if (!name || name.trim().length === 0)
      throw new Error("El nombre es obligatorio.");
    if (name.length > 80)
      throw new Error("El nombre no puede superar los 80 caracteres.");

    if (!email || email.length > 254)
      throw new Error("El email es obligatorio y debe ser válido.");

    if (!password || password.length < 6)
      throw new Error("La contraseña debe tener al menos 6 caracteres.");

    const hashed = await bcrypt.hash(password, 10);

    return await User.create({
      companyId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
      role: role || "worker",
    });
  },

  async getUsers(companyId) {
    if (!companyId) throw new Error("La empresa es obligatoria.");
    return await User.find({ companyId }).select("-password");
  },

  async getUserById(companyId, userId) {
    return await User.findOne({ _id: userId, companyId }).select("-password");
  },

  async updateUser(companyId, userId, data) {
    if (data.name && data.name.length > 80)
      throw new Error("El nombre no puede superar los 80 caracteres.");

    return await User.findOneAndUpdate({ _id: userId, companyId }, data, {
      new: true,
      runValidators: true,
    }).select("-password");
  },

  async deactivateUser(companyId, userId) {
    return await User.findOneAndUpdate(
      { _id: userId, companyId },
      { isActive: false },
      { new: true }
    );
  },

  async deleteUser(companyId, userId) {
    return await User.deleteOne({ _id: userId, companyId });
  },
};
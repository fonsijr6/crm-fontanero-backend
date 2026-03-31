const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  // ✅ LOGIN
  async login({ email, password }) {
    if (!email || !password) {
      throw new Error("Debes indicar email y contraseña.");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new Error("Credenciales incorrectas.");
    }

    if (!user.isActive) {
      throw new Error("Tu cuenta está desactivada.");
    }

    // ✅ Verificar bloqueo temporal
    if (user.isLocked && user.lockedUntil > new Date()) {
      throw new Error("Cuenta bloqueada temporalmente. Inténtalo más tarde.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= 5) {
        user.isLocked = true;
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
      }

      await user.save();
      throw new Error("Credenciales incorrectas.");
    }

    // ✅ Reset intentos
    user.loginAttempts = 0;
    user.isLocked = false;
    user.lockedUntil = null;
    user.lastLoginAt = new Date();
    await user.save();

    // ✅ Crear ACCESS TOKEN
    const token = jwt.sign(
      {
        userId: user._id,
        companyId: user.companyId,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    // ✅ Crear REFRESH TOKEN
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return {
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        companyId: user.companyId,
        role: user.role,
        permissions: user.permissions || {},
        mustChangePassword: user.mustChangePassword || false,
      }
    };
  },

  // ✅ REFRESH TOKEN
  async refreshTokens(oldRefreshToken) {
    if (!oldRefreshToken) {
      throw new Error("No hay token de actualización.");
    }

    let payload;
    try {
      payload = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      throw new Error("Refresh token inválido o expirado.");
    }

    const user = await User.findById(payload.userId);
    if (!user) throw new Error("Usuario no encontrado.");

    // ✅ Nuevo ACCESS TOKEN
    const accessToken = jwt.sign(
      {
        userId: user._id,
        companyId: user.companyId,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    // ✅ Nuevo REFRESH TOKEN
    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  },

  // ✅ CAMBIAR CONTRASEÑA PROPIA
  async changePassword(userId, { currentPassword, newPassword }) {
    if (!currentPassword || !newPassword) {
      throw new Error("Debes indicar ambas contraseñas.");
    }

    const user = await User.findById(userId).select("+password");
    if (!user) throw new Error("Usuario no encontrado.");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error("La contraseña actual no es correcta.");

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    user.mustChangePassword = false;
    user.lastPasswordChange = new Date();
    await user.save();
  }
};
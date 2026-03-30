const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  // ✅ LOGIN COMPLETO: seguridad PRO, bloqueo, auditoría
  async login({ email, password }) {
    if (!email || !password)
      throw new Error("Debes indicar email y contraseña.");

    if (email.length > 254)
      throw new Error("El email no puede superar los 254 caracteres.");

    // Buscar usuario
    const user = await User.findOne({ email }).select("+password");

    if (!user) throw new Error("Credenciales incorrectas.");

    // ✅ si está desactivado
    if (!user.isActive)
      throw new Error("Tu cuenta está desactivada. Contacta con el administrador de tu empresa.");

    // ✅ verificar bloqueo temporal
    if (user.isLocked && user.lockedUntil > new Date()) {
      throw new Error("Tu cuenta está bloqueada temporalmente. Inténtalo de nuevo más tarde.");
    }

    // ✅ comprobar contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.loginAttempts += 1;

      // bloquear si llega a 5 intentos
      if (user.loginAttempts >= 5) {
        user.isLocked = true;
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
      }

      await user.save();
      throw new Error("Credenciales incorrectas.");
    }

    // ✅ si coincide, reiniciar intentos
    user.loginAttempts = 0;
    user.isLocked = false;
    user.lockedUntil = null;
    user.lastLoginAt = new Date();
    await user.save();

    // ✅ Crear Access Token
    const token = jwt.sign(
      {
        userId: user._id,
        companyId: user.companyId,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    // ✅ Crear Refresh Token
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
      },
      requirePasswordChange: user.mustChangePassword || false,
    };
  },

  // ✅ REGISTRO (si lo usas en el futuro, por ahora no se usa)
  async register({ name, email, password }) {
    if (!name || name.length > 80)
      throw new Error("El nombre es obligatorio y no puede superar 80 caracteres.");

    if (!email || email.length > 254)
      throw new Error("El email es obligatorio y no puede superar los 254 caracteres.");

    if (!password || password.length < 6)
      throw new Error("La contraseña debe tener al menos 6 caracteres.");

    const exists = await User.findOne({ email });
    if (exists) throw new Error("Ya existe un usuario con ese email.");

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "owner", // si algún día permites auto‑registro
      companyId: null,
    });

    // generar tokens
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return { user, accessToken, refreshToken };
  },

  // ✅ REFRESH TOKENS
  async refreshTokens(oldRefreshToken) {
    if (!oldRefreshToken) throw new Error("Token de actualización no proporcionado.");

    let payload;
    try {
      payload = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      throw new Error("Token de actualización inválido o expirado.");
    }

    const user = await User.findById(payload.userId);
    if (!user) throw new Error("Usuario no encontrado.");

    // ✅ Nuevo access y refresh
    const accessToken = jwt.sign(
      {
        userId: user._id,
        companyId: user.companyId,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
  },

  // ✅ LOGOUT (en tu caso simplemente invalidamos la cookie)
  async logout(refreshToken) {
    return true; // si quisieras podrías llevar un registro de refresh tokens usados
  },

  // ✅ CAMBIO DE CONTRASEÑA PROPIO
  async changePassword(userId, { currentPassword, newPassword }) {
    if (!currentPassword || !newPassword)
      throw new Error("Debes indicar ambas contraseñas.");

    if (newPassword.length < 6)
      throw new Error("La nueva contraseña debe tener al menos 6 caracteres.");

    const user = await User.findById(userId).select("+password");
    if (!user) throw new Error("Usuario no encontrado.");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error("La contraseña actual no es correcta.");

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.mustChangePassword = false;
    user.lastPasswordChange = new Date();

    await user.save();
  },

  // ✅ CAMBIO FORZADO TRAS RESET (owner)
  async forcePasswordChange(userId, { newPassword }) {
    if (!newPassword) throw new Error("La nueva contraseña es obligatoria.");
    if (newPassword.length < 6)
      throw new Error("La nueva contraseña debe tener al menos 6 caracteres.");

    const user = await User.findById(userId).select("+password");
    if (!user) throw new Error("Usuario no encontrado.");

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.mustChangePassword = false;
    user.lastPasswordChange = new Date();

    await user.save();
  },

  // ✅ AUDITORÍA: Última actividad
  async registerActivity(userId, action) {
    if (action && action.length > 200)
      throw new Error("La descripción de actividad no puede superar 200 caracteres.");

    await User.findByIdAndUpdate(userId, {
      lastActivityAt: new Date(),
    });
  },
};
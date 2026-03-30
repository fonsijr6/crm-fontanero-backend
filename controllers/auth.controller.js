// controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const authService = require("../services/auth.service");
const isProd = process.env.NODE_ENV === "production";

// ✅ Configuración de cookies
const cookieOptions = {
  httpOnly: true,
  secure: isProd ? true : false,
  sameSite: isProd ? "none" : "lax",
  path: "/api/auth",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
};

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.rt;
    if (!refreshToken) return res.status(401).json({ msg: 'Falta refresh token' });

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = createAccessToken(payload.id);
    const newRefreshToken = createRefreshToken(payload.id);

    // renovar cookie
    res.cookie('rt', newRefreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true, 
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ token: newAccessToken });
    
  } catch (err) {
    return res.status(401).json({ msg: 'Refresh token inválido' });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { token, user, requirePasswordChange, refreshToken } =
      await authService.login(req.body);

    // ✅ Guardamos Refresh Token en cookie segura
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.json({
      msg: "Inicio de sesión correcto",
      token,
      user,
      requirePasswordChange,
    });
  } catch (e) {
    return res.status(e.status || 401).json({ msg: e.message });
  }
};

// ✅ REGISTER (si algún día quieres registro público; ahora no se usa)
exports.register = async (req, res) => {
  try {
    const { user, token, refreshToken } = await authService.register(req.body);

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(201).json({ user, token });
  } catch (e) {
    return res.status(e.status || 400).json({ msg: e.message });
  }
};

// ✅ REFRESH TOKEN (muy importante para apps móviles y sesiones largas)
exports.refresh = async (req, res) => {
  try {
    const oldToken = req.cookies.refreshToken;

    const { accessToken, refreshToken } =
      await authService.refreshTokens(oldToken);

    // ✅ Renovamos cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.json({ token: accessToken });
  } catch (e) {
    return res.status(e.status || 401).json({ msg: e.message });
  }
};

// ✅ LOGOUT (elimina cookie y revoca refresh token)
exports.logout = async (req, res) => {
  try {
    const oldToken = req.cookies.refreshToken;

    await authService.logout(oldToken);

    res.clearCookie("refreshToken", cookieOptions);

    return res.json({ msg: "Logout correcto" });
  } catch (e) {
    return res.status(500).json({ msg: "Error en logout" });
  }
};

// ✅ ME — Perfil del usuario autenticado
exports.getProfile  = async (req, res) => {
  try {
    return res.json({
      id: req.user.userId,
      name: req.user.name,
      email: req.user.email,
      companyId: req.user.companyId,
      role: req.user.role,
      lastLoginAt: req.user.lastLoginAt,
      lastActivityAt: req.user.lastActivityAt,
    });
  } catch (e) {
    return res.status(400).json({ msg: e.message });
  }
};

// ✅ CAMBIAR CONTRASEÑA (usuario autenticado)
exports.changePassword = async (req, res) => {
  try {
    await authService.changePassword(req.user.userId, req.body);
    return res.json({ msg: "Contraseña cambiada correctamente." });
  } catch (e) {
    return res.status(400).json({ msg: e.message });
  }
};

// ✅ FORZAR CAMBIO DE CONTRASEÑA (si has usado reset-password)
exports.forcePasswordChange = async (req, res) => {
  try {
    await authService.forcePasswordChange(req.user.userId, req.body);
    return res.json({ msg: "Contraseña actualizada correctamente." });
  } catch (e) {
    return res.status(400).json({ msg: e.message });
  }
};

// ✅ REGISTRAR ACTIVIDAD (opcional para auditoría)
exports.registerActivity = async (req, res) => {
  try {
    await authService.registerActivity(req.user.userId, req.body.action);
    return res.json({ msg: "Actividad registrada" });
  } catch (e) {
    return res.status(400).json({ msg: e.message });
  }
};
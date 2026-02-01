const authService = require('../services/auth.service');
const jwt = require('jsonwebtoken');

// =============== REGISTRO USUARIO ================== //
exports.register = async (req, res) => {
  try {
    const token = await authService.register(req.body);

    // Validación mínima
    if (!token.user.name || !token.user.email || !token.user.password) {
      return res.status(400).json({ message: 'Faltan de rellenar credenciales' });
    }

    res.status(201).json({token});

  } catch (error) {
    if (error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ message: 'Email ya registrado' });
    }
    res.sendStatus(400);
  }
};

// =============== LOGIN USUARIO ================== //
exports.login = async (req, res) => {
  try {
    const token = await authService.login(req.body);
    res.json({token});

    // 👉 Guardamos refresh token en cookie HttpOnly
    res.cookie('refresh', token.refresh, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 3600 * 1000,
    });

    // Devolvemos access token + data del usuario
    return res.status(200).json({
      access: token.access,
      user: token.user
    });

  } catch (error) {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
};

// =============== ME ================== //
exports.me = async (req, res) => {
  res.json({ id: req.user.id });
}
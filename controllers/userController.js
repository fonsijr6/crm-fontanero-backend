// controllers/userController.js
const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TTL  = process.env.JWT_ACCESS_TTL  || '15m';
// const REFRESH_TTL = process.env.JWT_REFRESH_TTL || '7d'; // solo si lo necesitas aquí

// =======================
//   REGISTRO DE USUARIO
// =======================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validación mínima
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'MISSING_FIELDS' });
    }

    const out = await userService.register(name, email, password);

    return res.status(201).json(out);

  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
};

// =======================
//       LOGIN
// =======================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'MISSING_FIELDS' });
    }

    const out = await userService.login(email, password);

    // 👉 Guardamos refresh token en cookie HttpOnly
    res.cookie('refresh', out.refresh, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 3600 * 1000,
    });

    // Devolvemos access token + data del usuario
    return res.status(200).json({
      access: out.access,
      user: out.user
    });

  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
};

// =======================
//    REFRESH TOKEN
// =======================
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies && req.cookies.refresh;

    if (!token) {
      return res.status(401).json({ error: 'NO_REFRESH' });
    }

    // Verificar refresh token
    let payload;
    try {
      payload = jwt.verify(token, REFRESH_SECRET);
    } catch (e) {
      return res.status(401).json({ error: 'INVALID_REFRESH' });
    }

    const sub = payload && payload.sub ? String(payload.sub) : '';
    if (!sub) {
      return res.status(401).json({ error: 'INVALID_REFRESH' });
    }

    // Crear nuevo access token
    const access = jwt.sign({ sub }, ACCESS_SECRET, { expiresIn: ACCESS_TTL });

    return res.status(200).json({ access });

  } catch (e) {
    console.error('refreshToken error:', e);
    return res.status(401).json({ error: 'INVALID_REFRESH' });
  }
};
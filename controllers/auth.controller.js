// controllers/auth.controller.js
const authService = require('../services/auth.service');
const isProd = process.env.NODE_ENV === 'production';

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
      secure: false, 
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ token: newAccessToken });
    
  } catch (err) {
    return res.status(401).json({ msg: 'Refresh token inválido' });
  }
};

const cookieOptions = {
  httpOnly: true,
  secure: isProd ? true : false,
  sameSite: isProd ? 'none' : 'lax',
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

// =============== LOGIN ================= //
exports.login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    res.cookie('refreshToken', refreshToken, cookieOptions);

    return res.json({
      user,
      token: accessToken
    });
  } catch (e) {
    return res.status(e.status || 401).json({ message: e.message });
  }
};

// =============== REGISTER ================= //
exports.register = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);

    res.cookie('refreshToken', refreshToken, cookieOptions);

    return res.status(201).json({
      user,
      token: accessToken
    });
  } catch (e) {
    return res.status(e.status || 400).json({ message: e.message });
  }
};

// =============== REFRESH ================= //
exports.refresh = async (req, res) => {
  try {
    const oldToken = req.cookies.refreshToken;

    const { accessToken, refreshToken } = await authService.refreshTokens(oldToken);

    res.cookie('refreshToken', refreshToken, cookieOptions);

    return res.json({ token: accessToken });
  } catch (e) {
    return res.status(e.status || 401).json({ message: e.message });
  }
};

// =============== LOGOUT ================= //
exports.logout = async (req, res) => {
  try {
    const rToken = req.cookies.refreshToken;

    await authService.logout(rToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProd ? true : false,
      sameSite: isProd ? 'none' : 'lax',
      path: '/api/auth'
    });

    return res.json({ message: 'Logout correcto' });
  } catch (e) {
    return res.status(500).json({ message: 'Error en logout' });
  }
};

// =============== ME ================== //
exports.me = async (req, res) => {
  res.json({ 
    id: req.auth.id,
    name: req.user.name,
    email: req.user.email
  });
}
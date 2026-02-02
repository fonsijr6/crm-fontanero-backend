// controllers/auth.controller.js
const authService = require('../services/auth.service');

// =============== REGISTRO USUARIO ================== //

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Faltan credenciales: name, email y password son obligatorios' });
    }

    // El servicio debe devolver { user, accessToken, refreshToken }
    const { user, accessToken, refreshToken } = await authService.register({ name, email, password });

    // Seteamos la cookie httpOnly del refresh
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd ? true : false,     // En localhost sin HTTPS debe ser false
      sameSite: isProd ? 'none' : 'lax', // 'none' solo si usas HTTPS y cross-site
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 días
    });

    // Respondemos con user + access token (mismo formato que login)
    return res.status(201).json({
      message: 'Usuario creado',
      user,
      token: accessToken,
    });
  } catch (error) {
    if (error.message === 'EMAIL_EXISTS' || error.status === 409) {
      return res.status(409).json({ message: 'Email ya registrado' });
    }
    next(error);
  }
};

// =============== LOGIN ================== //
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y password son obligatorios' });
    }

    const { user, accessToken, refreshToken } = await authService.login({ email, password });

    // Enviar refreshToken en Cookie HttpOnly
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd ? true : false,  // false en localhost
      sameSite: isProd ? "none" : "lax",
      path: "/api/auth",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    // Enviar user + accessToken al frontend
    return res.status(200).json({
      user,
      token: accessToken
    });
  } catch (error) {
    if (error.message === 'INVALID_CREDENTIALS' || error.status === 401) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    next(error); // o res.status(500).json({ message: 'Error en login' });
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
// controllers/auth.controller.js
const authService = require('../services/auth.service');

// =============== REGISTRO USUARIO ================== //
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validación antes del servicio
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Faltan credenciales: name, email y password son obligatorios' });
    }

    const { user, token } = await authService.register({ name, email, password });

    return res.status(201).json({
      message: 'Usuario creado',
      user,
      token
    });
  } catch (error) {
    if (error.message === 'EMAIL_EXISTS' || error.status === 409) {
      return res.status(409).json({ message: 'Email ya registrado' });
    }
    next(error); // o res.status(500).json({ message: 'Error al registrar' });
  }
};

// =============== LOGIN ================== //
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y password son obligatorios' });
    }

    const { user, token } = await authService.login({ email, password });

    return res.json({user,token});
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
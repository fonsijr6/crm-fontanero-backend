// services/user.service.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// ====== Config JWT ======
const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const ACCESS_TTL  = process.env.JWT_ACCESS_TTL  || '15m';
const REFRESH_TTL = process.env.JWT_REFRESH_TTL || '7d';

// Helpers para tokens
function signAccessToken(sub, role) {
  return jwt.sign({ sub, role }, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
}

function signRefreshToken(sub) {
  return jwt.sign({ sub, type: 'refresh' }, REFRESH_SECRET, { expiresIn: REFRESH_TTL });
}

// =============== REGISTER ==================
async function register(name, email, password) {
  // Comprobamos email ya registrado
  const exists = await User.findOne({ email }).lean();
  if (exists) {
    const err = new Error('EMAIL_IN_USE');
    err.status = 409; // conflict
    throw err;
  }

  // Hash de contraseña
  const passwordHash = await bcrypt.hash(password, 10);

  // Crear usuario
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: 'owner',
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

// =============== LOGIN ==================
async function login(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    const err = new Error('INVALID_CREDENTIALS');
    err.status = 401;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const err = new Error('INVALID_CREDENTIALS');
    err.status = 401;
    throw err;
  }

  const access  = signAccessToken(user.id, user.role);
  const refresh = signRefreshToken(user.id);

  return {
    access,
    refresh,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  };
}

module.exports = {
  register,
  login,
};
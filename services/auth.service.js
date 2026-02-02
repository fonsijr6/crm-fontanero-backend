const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =============== REGISTER ================== //
exports.register = async ({ name, email, password }) => {
  const exist = await User.findOne({ email }).lean();
  if (exist) {
    const err = new Error('EMAIL_EXISTS');
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: passwordHash });

  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    accessToken,
    refreshToken
  };
};

// =============== LOGIN ================== //
exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) throw createError('INVALID_CREDENTIALS');
  
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw createError('INVALID_CREDENTIALS');

  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    accessToken,
    refreshToken
  };
};

function createError(message) {
  const err = new Error(message);
  err.status = 401;
  return err;
}

function createAccessToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' } // acceso corto
  );
}

function createRefreshToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // sesión larga
  );
}
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// ====== Config JWT ======
const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const ACCESS_TTL  = process.env.JWT_ACCESS_TTL  || '15m';
const REFRESH_TTL = process.env.JWT_REFRESH_TTL || '7d';

// Helpers para tokens
function signAccessToken(sub) {
  return jwt.sign({ sub }, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
}

function signRefreshToken(sub) {
  return jwt.sign({ sub, type: 'refresh' }, REFRESH_SECRET, { expiresIn: REFRESH_TTL });
}

// =============== REGISTER ================== //
exports.register = async({name, email, password}) => {
  const exist = await User.findOne({email}).lean();
  if(exist) throw new Error('EMAIL_EXISTS');

  // Hash de contraseña
  const passwordHash = await bcrypt.hash(password, 10);
 
  // Crear usuario
  const user = await User.create({
    name,
    email,
    password: passwordHash
  });

  const access  = signAccessToken(user.id);
  const refresh = signRefreshToken(user.id);

  return {
    access,
    refresh,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };

};

// =============== LOGIN ================== //
exports.login = async({email, password}) => {
  const user = await User.findOne({email}).select('+password');
  if (!user) {
    const err = new Error('INVALID_CREDENTIALS');
    err.status = 401;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      const err = new Error('INVALID_CREDENTIALS');
      err.status = 401;
      throw err;
    }
    
  const access  = signAccessToken(user.id);
  const refresh = signRefreshToken(user.id);

  return {
    access,
    refresh,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };

};


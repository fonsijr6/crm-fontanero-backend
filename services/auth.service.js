const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =============== REGISTER ================== //
exports.register = async ({ name, email, password }) => {
  // ¿Existe?
  const exist = await User.findOne({ email }).lean();
  if (exist) {
    const err = new Error('EMAIL_EXISTS');
    err.status = 409;
    throw err;
  }

  // Hash de contraseña
  const passwordHash = await bcrypt.hash(password, 10);

  // Crear usuario
  const user = await User.create({
    name,
    email,
    password: passwordHash
  });

  // Generar token (auto-login opcional)
  const token = createToken(user.id); // user.id (virtual String) o user._id

  // Devuelve ambas cosas (recomendado para el controlador)
  return {
    user: {
      id: user.id,     // o user._id.toString()
      name: user.name,
      email: user.email
    },
    token
  };
};

// =============== LOGIN ================== //
exports.login = async ({ email, password }) => {
  // Trae el usuario con el hash de la contraseña
  // ⚠️ Solo necesitas .select('+password') si en el schema tienes select:false
  const user = await User.findOne({ email }).select('+password');

  // usuario no existe
  if (!user) {
    const err = new Error('INVALID_CREDENTIALS');
    err.status = 401;
    throw err;
  }

  // compara la contraseña en claro con el hash guardado
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const err = new Error('INVALID_CREDENTIALS');
    err.status = 401;
    throw err;
  }

  const token = createToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    token
  };
};

function createToken(userId) {
  // ✅ DEVUELVE el token
  return jwt.sign(
    { id: userId}, // o { sub: userId } si prefieres semántica JWT
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '7d' }
  );
}
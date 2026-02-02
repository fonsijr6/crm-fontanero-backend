const User = require('../models/User');
const Session = require('../models/Session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ================= REGISTER ================= //
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

  // Guardar refresh en BD (hash)
  await saveRefreshInDB(user.id, refreshToken);

  return {
    user: formatUser(user),
    accessToken,
    refreshToken
  };
};

// ================= LOGIN ================= //
exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw createError('INVALID_CREDENTIALS');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw createError('INVALID_CREDENTIALS');

  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

  await saveRefreshInDB(user.id, refreshToken);

  return {
    user: formatUser(user),
    accessToken,
    refreshToken
  };
};

// ================= REFRESH ================= //
exports.refreshTokens = async (tokenFromCookie) => {
  if (!tokenFromCookie) throw createError('NO_REFRESH_TOKEN');

  let payload;
  try {
    payload = jwt.verify(tokenFromCookie, process.env.JWT_REFRESH_SECRET);
  } catch (e) {
    throw createError('INVALID_REFRESH_TOKEN');
  }

  // Buscar sesión en BD
  const session = await Session.findOne({ userId: payload.id }).lean();
  if (!session) throw createError('SESSION_NOT_FOUND');

  const isMatch = await bcrypt.compare(tokenFromCookie, session.refreshTokenHash);

  if (!isMatch) {
    // Detección de reuso → token comprometido
    await Session.deleteMany({ userId: payload.id });
    throw createError('TOKEN_REUSED');
  }

  // Rotación: eliminar sesión vieja y crear una nueva
  await Session.deleteMany({ userId: payload.id });

  const newAccess = createAccessToken(payload.id);
  const newRefresh = createRefreshToken(payload.id);

  await saveRefreshInDB(payload.id, newRefresh);

  return {
    accessToken: newAccess,
    refreshToken: newRefresh
  };
};

// ================= LOGOUT ================= //
exports.logout = async (refreshTokenFromCookie) => {
  if (!refreshTokenFromCookie) return;

  let payload;
  try {
    payload = jwt.verify(refreshTokenFromCookie, process.env.JWT_REFRESH_SECRET);
  } catch {
    // Incluso si el token expiró, borra la sesión
    return Session.deleteMany({ refreshTokenHash: { $exists: true } });
  }

  await Session.deleteMany({ userId: payload.id });

  return { success: true };
};

// ================= HELPERS ================= //
function createError(message) {
  const err = new Error(message);
  err.status = 401;
  return err;
}

function createAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m'
  });
}

function createRefreshToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });
}

async function saveRefreshInDB(userId, refreshToken) {
  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  await Session.create({
    userId,
    refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 86400 * 1000)
  });
}

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}
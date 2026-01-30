// middleware/auth.mw.js
const jwt = require('jsonwebtoken');

module.exports.user = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No autorizado, falta token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // ⚠️ Usa el MISMO secreto que usas para firmar el access: JWT_ACCESS_SECRET
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // sub viene de tu signAccessToken(sub, role)
    req.user = { sub: decoded.sub, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido o expirado' });
  }
};
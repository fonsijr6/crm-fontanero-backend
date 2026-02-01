const jwt = require("jsonwebtoken");

module.exports.auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No autorizado, falta token" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    // sub viene de tu signAccessToken(sub, role)
    req.auth = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    next();
  } catch (err) {
    return res.sendStatus(401).json({ msg: "Token inválido o expirado" });
  }
};

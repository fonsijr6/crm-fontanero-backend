const jwt = require("jsonwebtoken");

module.exports.auth = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No autorizado, falta token" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "No autorizado, falta token" });
  }

  try {
    // sub/role según tu signAccessToken
    req.auth = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return next();
  } catch (err) {
    // ⚠️ No encadenes sendStatus con json; sendStatus ya finaliza la respuesta
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
}
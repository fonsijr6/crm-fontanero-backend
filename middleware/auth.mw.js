const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports.auth = async (req, res, next) => {
  // ✅ MUY IMPORTANTE: dejar pasar el preflight CORS
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch {
      return res.status(401).json({ msg: "Invalid or expired token" });
    }

    const userId = payload.userId;
    if (!userId) {
      return res.status(401).json({ msg: "Invalid token payload" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    if (!user.isActive) {
      return res.status(401).json({ msg: "User disabled" });
    }

    // ✅ Inyectamos usuario autenticado en la request
    req.user = {
      userId: user._id,
      companyId: user.companyId,
      role: user.role,
      permissions: user.permissions || {}
    };

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
};
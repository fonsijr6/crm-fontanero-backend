const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
      console.error("[JWT] Missing JWT_ACCESS_SECRET");
      return res.status(500).json({ msg: "JWT configuration error" });
    }

    // ✅ Decodifica token
    const payload = jwt.verify(token, secret);

    const userId = payload.id ?? payload.sub;
    if (!userId) {
      return res.status(401).json({ msg: "Token invalid (missing id)" });
    }

    // ✅ Carga usuario real (sin password)
    const user = await User.findById(userId).select("-password");

    if (!user || !user.isActive) {
      return res.status(401).json({ msg: "Invalid user" });
    }

    // ✅ Carga datos multi-empresa
    req.user = {
      userId: user._id,
      companyId: user.companyId,   // ✅ clave en multi-tenant
      role: user.role,             // ✅ roles (owner/admin/worker/viewer)
    };

    req.auth = payload;

    return next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};
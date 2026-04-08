const authService = require("../services/auth.service");

const isProd = process.env.NODE_ENV === "production";

// ✅ LOGIN
exports.login = async (req, res) => {
  console.log("LOGIN BODY:", req.body);
  try {
    const { token, refreshToken, user } = await authService.login(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,                 // ✅ true en producción
      sameSite: isProd ? "none" : "lax", // ✅ REQUIRED para dominios cruzados
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ token, user });
  } catch (e) {
    return res.status(401).json({ msg: e.message });
  }
};

// ✅ REFRESH
exports.refresh = async (req, res) => {
  try {
    const oldToken = req.cookies.refreshToken;

    const { accessToken, refreshToken } =
      await authService.refreshTokens(oldToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ token: accessToken });
  } catch {
    return res.status(401).json({ msg: "No autorizado" });
  }
};

// ✅ PERFIL
exports.me = async (req, res) => {
  return res.json(req.user);
};

// ✅ LOGOUT
exports.logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/"
    });

    return res.json({ msg: "Logout correcto" });
  } catch {
    return res.status(500).json({ msg: "Error en logout" });
  }
};
module.exports.requirePermission = (module, action) => {
  return (req, res, next) => {
    const permissions = req.user.permissions || {};

    // El owner nunca se bloquea
    if (req.user.role === "owner") return next(); 

    if (!permissions[module] || permissions[module][action] !== true) {
      return res.status(403).json({
        msg: "No tienes permisos para realizar esta acción"
      });
    }

    next();
  };
};
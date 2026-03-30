module.exports.requirePermission = (module, action) => {
  return (req, res, next) => {
    const perms = req.user.permissions?.[module];

    if (!perms || !perms[action]) {
      return res.status(403).json({ msg: "No tienes permisos para realizar esta acción." });
    }

    next();
  };
};
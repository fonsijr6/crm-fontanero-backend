// middleware/requireCompany.js

module.exports.requireCompany = (model, param = "id") => {
  return async (req, res, next) => {
    try {
      const entityId = req.params[param];

      if (!entityId) {
        return res.status(400).json({ msg: "ID no proporcionado en la ruta." });
      }

      // ✅ Buscar recurso
      const item = await model.findById(entityId);

      if (!item) {
        return res.status(404).json({ msg: "Recurso no encontrado." });
      }

      // ✅ Comparar companyId del recurso con la companyId del usuario autenticado
      if (item.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(403).json({ msg: "Acceso denegado: este recurso pertenece a otra empresa." });
      }

      // ✅ Todo correcto → pasar al siguiente middleware/controlador
      next();

    } catch (error) {
      console.error("Error en requireCompany:", error);
      return res.status(500).json({ msg: "Error validando empresa del recurso." });
    }
  };
};
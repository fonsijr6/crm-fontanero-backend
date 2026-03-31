module.exports.requireCompany = (model, param = "id") => {
  return async (req, res, next) => {
    try {
      const itemId = req.params[param];
      const item = await model.findById(itemId);
      if (!item) return res.status(404).json({ msg: "Recurso no encontrado" });

      if (item.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(403).json({ msg: "Recurso pertenece a otra empresa" });
      }

      next();
    } catch {
      return res.status(500).json({ msg: "Error validando recurso" });
    }
  };
};
// controllers/stock.controller.js
const stockService = require("../services/stock.service");

// ✅ Obtener todo el stock de la empresa
exports.getAll = async (req, res) => {
  try {
    const items = await stockService.getAll(req.user.companyId);
    return res.json(items);
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};

// ✅ Obtener un item concreto
exports.getOne = async (req, res) => {
  try {
    const item = await stockService.getOne(req.user.companyId, req.params.id);
    if (!item) return res.status(404).json({ msg: "Elemento de stock no encontrado." });

    return res.json(item);
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};

// ✅ Crear un item de stock
exports.create = async (req, res) => {
  try {
    const item = await stockService.create(req.user.companyId, req.user.userId, req.body);
    return res.status(201).json(item);
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};

// ✅ Actualizar item de stock (categoría, nombre, límites, etc.)
exports.update = async (req, res) => {
  try {
    const item = await stockService.update(
      req.user.companyId,
      req.params.id,
      req.body
    );
    return res.json(item);
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};

// ✅ Ajustar cantidad (+ / -)
exports.adjustStock = async (req, res) => {
  try {
    const { amount } = req.body; // positivo o negativo

    if (amount === undefined || isNaN(amount)) {
      return res.status(400).json({ msg: "Debes enviar una cantidad válida." });
    }

    const updated = await stockService.adjustStock(
      req.user.companyId,
      req.params.id,
      amount
    );

    return res.json({
      msg: "Stock actualizado correctamente.",
      item: updated,
    });
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};

// ✅ Eliminar item de stock
exports.remove = async (req, res) => {
  try {
    await stockService.remove(req.user.companyId, req.params.id);
    return res.json({ msg: "Item de stock eliminado correctamente." });
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};
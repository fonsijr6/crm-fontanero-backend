const stockService = require("../services/stock.service");

// ✅ Ver inventario completo (solo materiales)
exports.getInventory = async (req, res) => {
  try {
    const items = await stockService.getInventory(req.user.companyId);
    res.json(items);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// ✅ Ver stock de un producto concreto
exports.getByProduct = async (req, res) => {
  try {
    const item = await stockService.getByProduct(
      req.user.companyId,
      req.params.productId
    );

    if (!item) {
      return res.status(404).json({
        msg: "Este producto no gestiona stock",
      });
    }

    res.json(item);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// ✅ Ajustar stock (manual / consumo)
exports.adjust = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!Number.isFinite(amount)) {
      return res.status(400).json({ msg: "Cantidad inválida" });
    }

    const item = await stockService.adjust(
      req.user.companyId,
      req.params.id,
      amount
    );

    res.json(item);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
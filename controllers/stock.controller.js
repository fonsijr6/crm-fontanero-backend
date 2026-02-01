
const stockService = require('../services/stock.service');


/**
 * Crear material
 * POST /stock
 */
exports.create = async(req, res) => {
  try {
    const item = await stockService.createItem(
      req.user.id,
      req.body
    );
    res.status(201).json(item)
  } catch (error) {
    res.status(400).json({ message: 'Error al crear material' });
  }
};

/**
 *Listar stock del fontanero autenticado
 * GET /stock
 */
exports.getAll = async(req, res) => {
  try {
    const item = await stockService.getItems(req.user.id);
    res.status(201).json(item)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
};

/**
 *Obtener un material
 * GET /stock/:id
 */
exports.getOne = async(req, res) => {
  try {
    const item = await stockService.getItemById(req.user.id, req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Material no encontrado' })
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: 'ID de material inválido' });
  }
};

/**
 *Actualizar material
 * PUT /stock/:id
 */
exports.update = async(req, res) => {
  try {
    const item = await stockService.updateItem(
      req.user.id, 
      req.params.id,
      req.body
    );
    if (!item) {
      return res.status(404).json({ message: 'Material no encontrado' })
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el material' });
  }
};

/**
 *Eliminar material
 * DELETE /stock/:id
 */
exports.remove = async(req, res) => {
  try {
    const item = await stockService.deleteItem(
      req.user.id, 
      req.params.id
    );
    if (!item) {
      return res.status(404).json({ message: 'Material no encontrado' })
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar el material' });
  }
};


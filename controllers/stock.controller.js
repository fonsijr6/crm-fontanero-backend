// controllers/stock.controller.js
const stockService = require('../services/stock.service');
const mongoose = require('mongoose');

/**
 * Crear material
 * POST /stock
 */
exports.create = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const { name, typeMaterial, warehouseUnits, vanUnits } = req.body || {};
    const errors = [];

    // Obligatorios
    if (!name || typeof name !== 'string') {
      errors.push('name es obligatorio y debe ser string');
    }
    if (!typeMaterial || typeof typeMaterial !== 'string') {
      errors.push('typeMaterial es obligatorio y debe ser string');
    }

    // Opcionales (si vienen)
    if (warehouseUnits !== undefined) {
      const wu = Number(warehouseUnits);
      if (!Number.isInteger(wu) || wu < 0) {
        errors.push('warehouseUnits debe ser un entero mayor o igual que 0');
      }
    }
    if (vanUnits !== undefined) {
      const vu = Number(vanUnits);
      if (!Number.isInteger(vu) || vu < 0) {
        errors.push('vanUnits debe ser un entero mayor o igual que 0');
      }
    }

    if (errors.length) {
      return res.status(400).json({ message: 'Datos inválidos', errors });
    }

    const payload = {
      name: name.trim(),
      typeMaterial: typeMaterial.trim(),
      ...(warehouseUnits !== undefined && { warehouseUnits: Number(warehouseUnits) }),
      ...(vanUnits !== undefined && { vanUnits: Number(vanUnits) })
    };

    const item = await stockService.createItem(req.user.id, payload);
    return res.status(201).json(item);
  } catch (error) {
    if (error?.status === 409 || error?.message === 'ITEM_EXISTS') {
      return res.status(409).json({ message: 'El material ya existe' });
    }
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validación fallida', details: error.errors });
    }
    console.error('Error al crear material:', error);
    return res.status(500).json({ message: 'Error al crear material' });
  }
};

/**
 * Listar stock del fontanero autenticado
 * GET /stock
 */
exports.getAll = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    const items = await stockService.getItems(req.user.id);
    return res.status(200).json(items);
  } catch (error) {
    console.error('Error al obtener stock:', error);
    return res.status(500).json({ message: 'Error al obtener stock' });
  }
};

/**
 * Obtener un material
 * GET /stock/:id
 */
exports.getOne = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de material inválido' });
    }

    const item = await stockService.getItemById(req.user.id, id);
    if (!item) {
      return res.status(404).json({ message: 'Material no encontrado' });
    }
    return res.json(item);
  } catch (error) {
    console.error('Error al obtener material:', error);
    return res.status(500).json({ message: 'Error al obtener material' });
  }
};

/**
 * Actualizar material
 * PUT /stock/:id
 */
exports.update = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de material inválido' });
    }

    const { name, typeMaterial, warehouseUnits, vanUnits } = req.body || {};
    const errors = [];

    // Permitimos actualización parcial, pero validamos tipos si vienen
    if (name !== undefined && typeof name !== 'string') {
      errors.push('name debe ser string');
    }
    if (typeMaterial !== undefined && typeof typeMaterial !== 'string') {
      errors.push('typeMaterial debe ser string');
    }
    if (warehouseUnits !== undefined) {
      const wu = Number(warehouseUnits);
      if (!Number.isInteger(wu) || wu < 0) {
        errors.push('warehouseUnits debe ser un entero mayor o igual que 0');
      }
    }
    if (vanUnits !== undefined) {
      const vu = Number(vanUnits);
      if (!Number.isInteger(vu) || vu < 0) {
        errors.push('vanUnits debe ser un entero mayor o igual que 0');
      }
    }

    if (errors.length) {
      return res.status(400).json({ message: 'Datos inválidos', errors });
    }

    const payload = {
      ...(name !== undefined && { name: name.trim() }),
      ...(typeMaterial !== undefined && { typeMaterial: typeMaterial.trim() }),
      ...(warehouseUnits !== undefined && { warehouseUnits: Number(warehouseUnits) }),
      ...(vanUnits !== undefined && { vanUnits: Number(vanUnits) })
    };

    const item = await stockService.updateItem(req.user.id, id, payload);
    if (!item) {
      return res.status(404).json({ message: 'Material no encontrado' });
    }
    return res.json(item);
  } catch (error) {
    if (error?.status === 409 || error?.message === 'ITEM_EXISTS') {
      return res.status(409).json({ message: 'Ya existe un material con esos datos' });
    }
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validación fallida', details: error.errors });
    }
    console.error('Error al actualizar material:', error);
    return res.status(500).json({ message: 'Error al actualizar material' });
  }
};

/**
 * Eliminar material
 * DELETE /stock/:id
 */
exports.remove = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de material inválido' });
    }

    const item = await stockService.deleteItem(req.user.id, id);
    if (!item) {
      return res.status(404).json({ message: 'Material no encontrado' });
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error('Error al eliminar material:', error);
    return res.status(500).json({ message: 'Error al eliminar material' });
  }
};
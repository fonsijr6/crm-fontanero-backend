// controllers/stock.controller.js
const stockService = require('../services/stock.service');
const mongoose = require('mongoose');

/**
 * Create stock item
 * POST /stock
 */
exports.create = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { name, category, quantity, unit, unitPrice, minStock } = req.body || {};
    const errors = [];

    if (!name || typeof name !== 'string') errors.push('Name is required and must be a string');
    if (!category || typeof category !== 'string') errors.push('Category is required and must be a string');
    if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) errors.push('Quantity must be a non-negative integer');
    if (unit !== undefined && typeof unit !== 'string') errors.push('Unit must be a string if provided');
    if (unitPrice !== undefined && typeof unitPrice !== 'number') errors.push('UnitPrice must be a number if provided');
    if (minStock !== undefined && (!Number.isInteger(minStock) || minStock < 0)) errors.push('minStock must be a non-negative integer');

    if (errors.length) return res.status(400).json({ message: 'Invalid data', errors });

    const payload = {
      name: name.trim(),
      category: category.trim(),
      ...(quantity !== undefined && { quantity }),
      ...(unit !== undefined && { unit: unit.trim() }),
      ...(unitPrice !== undefined && { unitPrice }),
      ...(minStock !== undefined && { minStock }),
    };

    const item = await stockService.createItem(req.user.id, payload);
    return res.status(201).json(item);

  } catch (error) {
    if (error?.status === 409 || error?.message === 'ITEM_EXISTS') {
      return res.status(409).json({ message: 'Item already exists' });
    }
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', details: error.errors });
    }
    console.error('Error creating item:', error);
    return res.status(500).json({ message: 'Error creating item' });
  }
};

/**
 * Get all stock items
 * GET /stock
 */
exports.getAll = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const items = await stockService.getItems(req.user.id);
    return res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching stock:', error);
    return res.status(500).json({ message: 'Error fetching stock' });
  }
};

/**
 * Get stock item by ID
 * GET /stock/:id
 */
exports.getOne = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid item ID' });

    const item = await stockService.getItemById(req.user.id, id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    return res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    return res.status(500).json({ message: 'Error fetching item' });
  }
};

/**
 * Update stock item
 * PUT /stock/:id
 */
exports.update = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid item ID' });

    const { name, category, quantity, unit, unitPrice, minStock } = req.body || {};
    const errors = [];

    if (name !== undefined && typeof name !== 'string') errors.push('Name must be string');
    if (category !== undefined && typeof category !== 'string') errors.push('Category must be string');
    if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) errors.push('Quantity must be a non-negative integer');
    if (unit !== undefined && typeof unit !== 'string') errors.push('Unit must be string');
    if (unitPrice !== undefined && typeof unitPrice !== 'number') errors.push('UnitPrice must be number');
    if (minStock !== undefined && (!Number.isInteger(minStock) || minStock < 0)) errors.push('minStock must be a non-negative integer');

    if (errors.length) return res.status(400).json({ message: 'Invalid data', errors });

    const payload = {
      ...(name !== undefined && { name: name.trim() }),
      ...(category !== undefined && { category: category.trim() }),
      ...(quantity !== undefined && { quantity }),
      ...(unit !== undefined && { unit: unit.trim() }),
      ...(unitPrice !== undefined && { unitPrice }),
      ...(minStock !== undefined && { minStock }),
    };

    const item = await stockService.updateItem(req.user.id, id, payload);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    return res.json(item);

  } catch (error) {
    if (error?.status === 409 || error?.message === 'ITEM_EXISTS') {
      return res.status(409).json({ message: 'Item with these details already exists' });
    }
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', details: error.errors });
    }
    console.error('Error updating item:', error);
    return res.status(500).json({ message: 'Error updating item' });
  }
};

/**
 * Delete stock item
 * DELETE /stock/:id
 */
exports.remove = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid item ID' });

    const item = await stockService.deleteItem(req.user.id, id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    return res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting item:', error);
    return res.status(500).json({ message: 'Error deleting item' });
  }
};
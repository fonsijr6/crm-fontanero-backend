// controllers/client.controller.js
const clientService = require('../services/client.service');
const mongoose = require('mongoose');

/**
 * Crear cliente
 * POST /clients
 */
exports.create = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const { name, surname1, surname2, phone, address, notes } = req.body || {};

    // Validación básica
    const errors = [];
    if (!name || typeof name !== 'string') errors.push('Nombre es obligatorio y debe ser string');
    if (!surname1 || typeof surname1 !== 'string') errors.push('Apellido 1 es obligatorio y debe ser string');
    if (surname2 !== undefined && typeof surname2 !== 'string') errors.push('Apelido 2 debe ser string si se envía');
    if (!phone || typeof phone !== 'string') errors.push('Telefono es obligatorio y debe ser string');
    if (!address || typeof address !== 'string') errors.push('Direccion es obligatorio y debe ser string');
    if (notes !== undefined && typeof notes !== 'string') errors.push('Notas debe ser string si se envía');

    if (errors.length) {
      return res.status(400).json({ message: 'Datos inválidos', errors });
    }

    const payload = {
      name: name.trim(),
      surname1: surname1.trim(),
      surname2: surname2?.trim(),
      phone: phone.trim(),
      address: address.trim(),
      notes: notes?.trim()
    };

    const client = await clientService.createClient(req.user.id, payload);
    return res.status(201).json(client);
  } catch (error) {
    // Duplicados, validaciones de mongoose, etc.
    if (error?.status === 409 || error?.message === 'CLIENT_EXISTS') {
      return res.status(409).json({ message: 'Cliente ya existe' });
    }
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validación fallida', details: error.errors });
    }
    console.error('Error al crear cliente:', error);
    return res.status(500).json({ message: 'Error al crear cliente' });
  }
};

/**
 * Listar clientes del fontanero autenticado
 * GET /clients
 */
exports.getAll = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const clients = await clientService.getClients(req.user.id);
    return res.status(200).json(clients);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return res.status(500).json({ message: 'Error al obtener clientes' });
  }
};

/**
 * Obtener un cliente
 * GET /clients/:id
 */
exports.getOne = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de cliente inválido' });
    }

    const client = await clientService.getClientById(req.user.id,id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    return res.json(client);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    return res.status(500).json({ message: 'Error al obtener cliente' });
  }
};

/**
 * Actualizar cliente
 * PUT /clients/:id
 */
exports.update = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de cliente inválido' });
    }

    const { name, surname1, surname2, phone, address, notes } = req.body || {};
    const errors = [];

    // Permitimos parciales, pero validamos tipos si vienen
    if (name !== undefined && typeof name !== 'string') errors.push('name debe ser string');
    if (surname1 !== undefined && typeof surname1 !== 'string') errors.push('surname1 debe ser string');
    if (surname2 !== undefined && typeof surname2 !== 'string') errors.push('surname2 debe ser string');
    if (phone !== undefined && typeof phone !== 'string') errors.push('phone debe ser string');
    if (address !== undefined && typeof address !== 'string') errors.push('address debe ser string');
    if (notes !== undefined && typeof notes !== 'string') errors.push('notes debe ser string');

    if (errors.length) {
      return res.status(400).json({ message: 'Datos inválidos', errors });
    }

    const payload = {
      ...(name !== undefined && { name: name.trim() }),
      ...(surname1 !== undefined && { surname1: surname1.trim() }),
      ...(surname2 !== undefined && { surname2: surname2.trim() }),
      ...(phone !== undefined && { phone: phone.trim() }),
      ...(address !== undefined && { address: address.trim() }),
      ...(notes !== undefined && { notes: notes.trim() })
    };

    const client = await clientService.updateClient(req.user.id, id, payload);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    return res.json(client);
  } catch (error) {
    if (error?.status === 409 || error?.message === 'CLIENT_EXISTS') {
      return res.status(409).json({ message: 'Ya existe un cliente con esos datos' });
    }
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validación fallida', details: error.errors });
    }
    console.error('Error al actualizar cliente:', error);
    return res.status(500).json({ message: 'Error al actualizar cliente' });
  }
};

/**
 * Eliminar cliente
 * DELETE /clients/:id
 */
exports.remove = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de cliente inválido' });
    }

    const client = await clientService.deleteClient(req.user.id, id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    return res.status(500).json({ message: 'Error al eliminar cliente' });
  }
};
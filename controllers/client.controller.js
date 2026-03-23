// controllers/client.controller.js
const clientService = require('../services/client.service');
const mongoose = require('mongoose');

/**
 * Create client
 * POST /clients
 */
exports.create = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { name, phone, email, address, notes } = req.body || {};

    const errors = [];
    if (!name || typeof name !== 'string') errors.push('Name is required and must be a string');
    if (!phone || typeof phone !== 'string') errors.push('Phone is required and must be a string');
    if (!email || typeof email !== 'string') errors.push('Email is required and must be a string');
    if (!address || typeof address !== 'string') errors.push('Address is required and must be a string');
    if (notes !== undefined && typeof notes !== 'string') errors.push('Notes must be a string if provided');

    if (errors.length) return res.status(400).json({ message: 'Invalid data', errors });

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      notes: notes?.trim(),
    };

    const client = await clientService.createClient(req.user.id, payload);
    return res.status(201).json(client);

  } catch (error) {
    if (error?.status === 409 || error?.message === 'CLIENT_EXISTS') {
      return res.status(409).json({ message: 'Client already exists' });
    }
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', details: error.errors });
    }
    console.error('Error creating client:', error);
    return res.status(500).json({ message: 'Error creating client' });
  }
};

/**
 * Get all clients for the authenticated user
 * GET /clients
 */
exports.getAll = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const clients = await clientService.getClients(req.user.id);
    return res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return res.status(500).json({ message: 'Error fetching clients' });
  }
};

/**
 * Get a single client by ID
 * GET /clients/:id
 */
exports.getOne = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid client ID' });

    const client = await clientService.getClientById(req.user.id, id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    return res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return res.status(500).json({ message: 'Error fetching client' });
  }
};

/**
 * Update client
 * PUT /clients/:id
 */
exports.update = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid client ID' });

    const { name, phone, email, address, notes } = req.body || {};
    const errors = [];

    if (name !== undefined && typeof name !== 'string') errors.push('name must be string');
    if (phone !== undefined && typeof phone !== 'string') errors.push('phone must be string');
    if (email !== undefined && typeof email !== 'string') errors.push('email must be string');
    if (address !== undefined && typeof address !== 'string') errors.push('address must be string');
    if (notes !== undefined && typeof notes !== 'string') errors.push('notes must be string');

    if (errors.length) return res.status(400).json({ message: 'Invalid data', errors });

    const payload = {
      ...(name !== undefined && { name: name.trim() }),
      ...(phone !== undefined && { phone: phone.trim() }),
      ...(email !== undefined && { email: email.trim() }),
      ...(address !== undefined && { address: address.trim() }),
      ...(notes !== undefined && { notes: notes.trim() }),
    };

    const client = await clientService.updateClient(req.user.id, id, payload);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    return res.json(client);

  } catch (error) {
    if (error?.status === 409 || error?.message === 'CLIENT_EXISTS') {
      return res.status(409).json({ message: 'Client with these details already exists' });
    }
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', details: error.errors });
    }
    console.error('Error updating client:', error);
    return res.status(500).json({ message: 'Error updating client' });
  }
};

/**
 * Delete client
 * DELETE /clients/:id
 */
exports.remove = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid client ID' });

    const client = await clientService.deleteClient(req.user.id, id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    return res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting client:', error);
    return res.status(500).json({ message: 'Error deleting client' });
  }
};
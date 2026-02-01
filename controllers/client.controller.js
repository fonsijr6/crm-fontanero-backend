
const clientService = require('../services/client.service');


/**
 * Crear cliente
 * POST /clients
 */
exports.create = async(req, res) => {
  try {
    const client = await clientService.createClient(
      req.user.id,
      req.body
    );
    res.status(201).json(client)
  } catch (error) {
    res.status(400).json({ message: 'Error al crear cliente' });
  }
};

/**
 *Listar clientes del fontanero autenticado
 * GET /clients
 */
exports.getAll = async(req, res) => {
  try {
    const clients = await clientService.getClients(req.user.id);
    res.status(201).json(clients)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
};

/**
 *Obtener un cliente
 * GET /clients/:id
 */
exports.getOne = async(req, res) => {
  try {
    const client = await clientService.getClientById(req.user.id, req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' })
    }
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: 'ID de cliente inválido' });
  }
};

/**
 *Actualizar cliente
 * PUT /clients/:id
 */
exports.update = async(req, res) => {
  try {
    const client = await clientService.updateClient(
      req.user.id, 
      req.params.id,
      req.body
    );
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' })
    }
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el cliente' });
  }
};

/**
 *Eliminar cliente
 * DELETE /clients/:id
 */
exports.remove = async(req, res) => {
  try {
    const client = await clientService.deleteClient(
      req.user.id, 
      req.params.id
    );
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' })
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar el cliente' });
  }
};


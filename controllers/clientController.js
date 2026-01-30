
const clientService = require('../services/client.service');


const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/** GET /api/clients */
exports.listClients = asyncHandler(async (req, res) => {
  const ownerId = req.user.sub;
  const clients = await clientService.listClientsByOwner(ownerId);
  res.json(clients);
});

/** POST /api/clients */
exports.addClient = asyncHandler(async (req, res) => {
  const ownerId = req.user.sub;
  const { name, phone, address, notes } = req.body;

  if (!name || name.length < 2) {
    return res.status(400).json({ msg: 'El nombre es obligatorio y debe tener al menos 2 caracteres' });
  }

  const created = await clientService.createClient(ownerId, { name, phone, address, notes });
  res.status(201).json(created);
});

/** PUT /api/clients/:id */
exports.updateClient = asyncHandler(async (req, res) => {
  const ownerId = req.user.sub;
  const { id } = req.params;

  const updated = await clientService.updateClientByOwner(id, ownerId, req.body);

  if (!updated) {
    return res.status(404).json({ msg: 'El cliente no existe o no te pertenece' });
  }

  res.json(updated);
});

/** GET /api/clients/:id */
exports.getClient = asyncHandler(async (req, res) => {
  const ownerId = req.user.sub;
  const { id } = req.params;

  const client = await clientService.getClientByOwner(id, ownerId);

  if (!client) {
    return res.status(404).json({ msg: 'Cliente no encontrado' });
  }

  res.json(client);
});

/** DELETE /api/clients/:id */
exports.deleteClient = asyncHandler(async (req, res) => {
  const ownerId = req.user.sub;
  const { id } = req.params;

  const deleted = await clientService.deleteClientByOwner(id, ownerId);

  if (!deleted) {
    return res.status(404).json({ msg: 'El cliente no existe o no te pertenece' });
  }

  res.json({ msg: 'Cliente eliminado correctamente' });
});
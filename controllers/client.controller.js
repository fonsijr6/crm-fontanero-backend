const clientService = require("../services/client.service");

exports.createClient = async (req, res) => {
  try {
    const client = await clientService.createClient(
      req.user.companyId,
      req.user.userId,
      req.body
    );

    res.locals.client = client;
    res.json(client);

    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await clientService.getClients(req.user.companyId);
    res.json(clients);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getClient = async (req, res) => {
  try {
    const client = await clientService.getClient(
      req.user.companyId,
      req.params.id
    );
    if (!client) return res.status(404).json({ msg: "Cliente no encontrado" });
    res.json(client);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await clientService.updateClient(
      req.user.companyId,
      req.params.id,
      req.body
    );
    res.locals.client = client;
    res.json(client);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await clientService.deleteClient(req.user.companyId, req.params.id);
    res.locals.client = client;
    res.json(client);
    res.json({ msg: "Cliente eliminado correctamente" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
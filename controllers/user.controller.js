const userService = require("../services/user.service");

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser({
      companyId: req.user.companyId,
      ...req.body
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getUsers = async (req, res) => {
  const users = await userService.getUsers(req.user.companyId);
  res.json(users);
};

exports.getUser = async (req, res) => {
  const user = await userService.getUserById(req.user.companyId, req.params.id);
  if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const user = await userService.updateUser(
    req.user.companyId,
    req.params.id,
    req.body
  );
  res.json(user);
};

exports.updatePermissions = async (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ msg: "Solo el owner puede cambiar permisos" });
  }

  const user = await userService.updatePermissions(
    req.user.companyId,
    req.params.id,
    req.body.permissions
  );

  res.json(user);
};

exports.deactivateUser = async (req, res) => {
  const user = await userService.deactivateUser(
    req.user.companyId,
    req.params.id
  );
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  await userService.deleteUser(req.user.companyId, req.params.id);
  res.json({ msg: "Usuario eliminado correctamente" });
};
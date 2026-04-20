const userService = require("../services/user.service");

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser({
      companyId: req.user.companyId,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    });

    return res.status(201).json(user);
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers(req.user.companyId);
    return res.json(users);
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.companyId, req.params.id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
    return res.json(user);
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(
      req.user.companyId,
      req.params.id,
      req.body
    );
    return res.json(user);
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const user = await userService.deactivateUser(req.user.companyId, req.params.id);
    return res.json(user);
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};

exports.updatePermissions = async (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ msg: "Solo el owner puede cambiar permisos" });
  }

  const { userId, permissions } = req.body;

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId, companyId: req.user.companyId },
    { permissions },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    return res.status(404).json({ msg: "Usuario no encontrado" });
  }

  res.json(updatedUser);
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.user.companyId, req.params.id);
    return res.json({ msg: "Usuario eliminado correctamente" });
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};
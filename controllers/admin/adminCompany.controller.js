const adminService = require("../../services/adminCompany.service");

exports.createCompanyWithOwner = async (req, res) => {
  try {
    const result = await adminService.createCompanyWithOwner(req.body);
    return res.status(201).json(result);
  } catch (e) {
    return res.status(400).json({ msg: e.message });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const data = await adminService.getCompanies();
    return res.json(data);
  } catch (e) {
    return res.status(400).json({ msg: e.message });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const data = await adminService.getCompany(req.params.id);
    if (!data) return res.status(404).json({ msg: "Empresa no encontrada." });
    return res.json(data);
  } catch (e) {
    return res.status(400).json({ msg: e.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const updated = await adminService.updateCompany(req.params.id, req.body);
    return res.json(updated);
  } catch (e) {
    return res.status(400).json({ msg: e.message });
  }
};

exports.desactivateCompany = async (req, res) => {
  try {
    const updated = await adminService.deactivateCompany(req.params.id);
    return res.json(updated);
  } catch (e) {
    return res.status(400).json({ msg: e.message });
  }
};
const bcrypt = require("bcryptjs");
const Company = require("../models/Company");
const User = require("../models/User");

module.exports = {
  // ✅ Crear empresa + owner
  async createCompanyWithOwner(data) {
    const {
      name,
      legalName,
      companyNif,
      fiscalAddress,
      companyEmail,
      companyPhone,
      modulesEnabled,
      ownerName,
      ownerEmail,
      ownerPassword
    } = data;

    if (!name || name.length > 80)
      throw new Error("El nombre de la empresa es obligatorio y debe ser válido.");

    if (!companyNif)
      throw new Error("El NIF/CIF es obligatorio.");

    if (!ownerEmail || !ownerPassword)
      throw new Error("El dueño de la empresa debe tener email y contraseña.");

    // ✅ Crear empresa
    const company = await Company.create({
      name,
      legalName,
      companyNif,
      fiscalAddress,
      companyEmail,
      companyPhone,
      modulesEnabled: modulesEnabled || ["clients", "tasks", "invoices", "quotes"],
      settings: {
        invoicePrefix: "FAC-",
        quotePrefix: "PRES-",
        taskPrefix: "TSK-",
        lastInvoiceNumber: 0,
        lastQuoteNumber: 0,
        lastTaskNumber: 0
      }
    });

    // ✅ Crear owner
    const hashed = await bcrypt.hash(ownerPassword, 10);

    const owner = await User.create({
      name: ownerName,
      email: ownerEmail,
      password: hashed,
      role: "owner",
      companyId: company._id
    });

    // ✅ Relacionar empresa con owner
    company.ownerUserId = owner._id;
    await company.save();

    return {
      msg: "Empresa y dueño creados correctamente.",
      company,
      owner,
      tempPassword: ownerPassword
    };
  },

  // ✅ Listar todas las empresas
  async getCompanies() {
    return await Company.find().sort({ createdAt: -1 });
  },

  // ✅ Ver empresa
  async getCompany(companyId) {
    return await Company.findById(companyId).populate("ownerUserId", "name email role");
  },

  // ✅ Actualizar empresa
  async updateCompany(companyId, data) {
    return await Company.findByIdAndUpdate(companyId, data, { new: true });
  },

  // ✅ Desactivar empresa (y empleados opcionalmente)
  async deactivateCompany(companyId) {
    const company = await Company.findById(companyId);
    if (!company) throw new Error("Empresa no encontrada.");

    company.isActive = false;
    await company.save();

    // ❗ Opcional: desactivar empleados
    await User.updateMany({ companyId }, { isActive: false });

    return {
      msg: "Empresa desactivada correctamente.",
      company
    };
  }
};
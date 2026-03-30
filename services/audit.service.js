const AuditLog = require("../models/AuditLog");

module.exports = {
  async log({ companyId, userId, action, module, entityId, ip, userAgent }) {
    return await AuditLog.create({
      companyId,
      userId,
      action,
      module,
      entityId,
      ip,
      userAgent
    });
  },

  async getLogs(companyId, filters = {}) {
    return await AuditLog.find({ companyId, ...filters })
      .populate("userId", "name email role")
      .sort({ createdAt: -1 })
      .limit(200);
  }
};
const AuditLog = require("../models/AuditLog");

module.exports = {
  async log({
    companyId,
    userId,
    module,
    action,
    entityId = null,
    entityLabel = null,
    meta = null,
    req,
  }) {
    return AuditLog.create({
      companyId,
      userId,
      module,
      action,
      entityId,
      entityLabel,
      meta,
      ip: req?.ip,
      userAgent: req?.headers["user-agent"],
    });
  },

  async getLogs(companyId, filters = {}, options = {}) {
    const {
      limit = 200,
      skip = 0,
    } = options;

    return AuditLog.find({ companyId, ...filters })
      .populate("userId", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  },
};

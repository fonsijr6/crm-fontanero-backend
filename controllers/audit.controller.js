const auditService = require("../services/audit.service");

module.exports.getAuditLogs = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;

    const {
      module,
      action,
      userId,
      entityId,
      from,
      to,
      page = 1,
      limit = 50,
    } = req.query;

    const filters = {};

    if (module) filters.module = module;
    if (action) filters.action = action;
    if (userId) filters.userId = userId;
    if (entityId) filters.entityId = entityId;

    if (from || to) {
      filters.createdAt = {};
      if (from) filters.createdAt.$gte = new Date(from);
      if (to) filters.createdAt.$lte = new Date(to);
    }

    const logs = await auditService.getLogs(companyId, filters, {
      limit: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    });

    res.json(logs);
  } catch (err) {
    next(err);
  }
};
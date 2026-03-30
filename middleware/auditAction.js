const auditService = require("../services/audit.service");

module.exports.auditAction = (action, module) => {
  return async (req, res, next) => {
    res.on("finish", async () => {
      try {
        if (res.statusCode < 400) {
          await auditService.log({
            companyId: req.user.companyId,
            userId: req.user.userId,
            action,
            module,
            entityId: req.params.id || null,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
          });
        }
      } catch (e) {
        console.error("❌ Error guardando audit log:", e.message);
      }
    });

    next();
  };
};
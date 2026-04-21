const auditService = require("../services/audit.service");

module.exports.auditAction = ({
  module,
  action,
  getEntityId,
  getEntityLabel,
  getMeta,
}) => {
  return async (req, res, next) => {
    res.on("finish", async () => {
      try {
        if (res.statusCode < 400 && req.user) {
          await auditService.log({
            companyId: req.user.companyId,
            userId: req.user.userId,
            module,
            action,

            entityId: getEntityId ? getEntityId(req, res) : req.params.id || null,
            entityLabel: getEntityLabel ? getEntityLabel(req, res) : null,
            meta: getMeta ? getMeta(req, res) : null,

            req,
          });
        }
      } catch (e) {
        console.error("❌ Error guardando audit log:", e.message);
      }
    });

    next();
  };
};
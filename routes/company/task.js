router.post(
  "/",
  auth,
  requireRole(["owner", "admin", "worker"]),
  controller.createTask
);

router.get(
  "/",
  auth,
  requireRole(["owner", "admin", "worker", "viewer"]),
  controller.getTasks
);

router.get(
  "/:id",
  auth,
  requireCompany(Task),
  requireRole(["owner", "admin", "worker", "viewer"]),
  controller.getTask
);

router.put(
  "/:id",
  auth,
  requireCompany(Task),
  requireRole(["owner", "admin", "worker"]),
  controller.updateTask
);

router.delete(
  "/:id",
  auth,
  requireCompany(Task),
  requireRole(["owner", "admin"]),
  controller.deleteTask
);
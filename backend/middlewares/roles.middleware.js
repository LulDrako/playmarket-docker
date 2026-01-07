const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentification requise" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Accès interdit - Permissions insuffisantes",
        requiredRoles: allowedRoles,
        userRole: req.user.role,
      });
    }

    next();
  };
};

const requireAdmin = requireRole("admin");
const requireUser = requireRole("user", "admin");

module.exports = {
  requireRole,
  requireAdmin,
  requireUser,
};


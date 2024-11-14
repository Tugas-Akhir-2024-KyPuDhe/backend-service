const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });
  
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
    } catch (error) {
      res.status(400).json({ message: 'Invalid Token' });
    }
  };

const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        // Pastikan authMiddleware sudah berjalan untuk mendapatkan req.user
        if (!req.user || !allowedRoles.includes(req.user.roles)) {
            return res.status(403).json({ status:403, message: "Access denied" });
        }
        next();
    };
};

module.exports = { authMiddleware, authorizeRoles };

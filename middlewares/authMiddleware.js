const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; 

    if (!token) {
        return res.status(403).json({ message: "Token is required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = decoded; 
        next();
    });
};

const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        // Pastikan authMiddleware sudah berjalan untuk mendapatkan req.user
        if (!req.user || !allowedRoles.includes(req.user.roles)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};

module.exports = { authMiddleware, authorizeRoles };

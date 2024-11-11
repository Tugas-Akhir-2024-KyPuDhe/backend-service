const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ status: 403, message: "Token is required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                const newToken = jwt.sign(
                    {
                        username: decoded.username,
                        name: decoded.name,
                        roles: decoded.roles,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" } 
                );
                res.setHeader("authorization", `Bearer ${newToken}`);
                req.user = decoded;
                return next();
            } else {
                return res.status(401).json({ status: 401, message: "Invalid token" });
            }
        }

        req.user = decoded;
        next();
    });
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

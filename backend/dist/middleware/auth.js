"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateToken = void 0;
const UserService_1 = require("../services/UserService");
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        res.status(401).json({ error: 'Zugriff verweigert. Token erforderlich.' });
        return;
    }
    const decoded = UserService_1.UserService.verifyToken(token);
    if (!decoded) {
        res.status(403).json({ error: 'Ungültiges oder abgelaufenes Token.' });
        return;
    }
    req.user = decoded;
    next();
};
exports.authenticateToken = authenticateToken;
const requireRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentifizierung erforderlich.' });
            return;
        }
        if (req.user.role !== requiredRole && req.user.role !== 'admin') {
            res.status(403).json({ error: 'Unzureichende Berechtigungen.' });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map
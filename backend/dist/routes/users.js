"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const UserService_1 = require("../services/UserService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Registrierung
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('first_name').optional().isLength({ min: 1 }),
    (0, express_validator_1.body)('last_name').optional().isLength({ min: 1 })
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userData = req.body;
        const user = await UserService_1.UserService.createUser(userData);
        // Passwort-Hash aus der Response entfernen
        const { password_hash, ...userResponse } = user;
        res.status(201).json({
            message: 'Benutzer erfolgreich erstellt',
            user: userResponse
        });
    }
    catch (error) {
        console.error('Registrierungsfehler:', error);
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Registrierung fehlgeschlagen'
        });
    }
});
// Login
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').exists()
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const loginData = req.body;
        const authResponse = await UserService_1.UserService.authenticateUser(loginData);
        if (!authResponse) {
            return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
        }
        res.json({
            message: 'Anmeldung erfolgreich',
            ...authResponse
        });
    }
    catch (error) {
        console.error('Login-Fehler:', error);
        res.status(500).json({ error: 'Anmeldung fehlgeschlagen' });
    }
});
// Aktueller Benutzer abrufen
router.get('/me', auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Nicht authentifiziert' });
        }
        const user = await UserService_1.UserService.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }
        const { password_hash, ...userResponse } = user;
        res.json({ user: userResponse });
    }
    catch (error) {
        console.error('Fehler beim Abrufen des Benutzers:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen des Benutzers' });
    }
});
// Alle Benutzer abrufen (nur Admin)
router.get('/', auth_1.authenticateToken, (0, auth_1.requireRole)('admin'), async (req, res) => {
    try {
        const users = await UserService_1.UserService.getAllUsers();
        res.json({ users });
    }
    catch (error) {
        console.error('Fehler beim Abrufen der Benutzer:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Benutzer' });
    }
});
// Benutzer aktualisieren
router.put('/:id', auth_1.authenticateToken, [
    (0, express_validator_1.body)('first_name').optional().isLength({ min: 1 }),
    (0, express_validator_1.body)('last_name').optional().isLength({ min: 1 }),
    (0, express_validator_1.body)('role').optional().isIn(['user', 'admin', 'moderator']),
    (0, express_validator_1.body)('is_active').optional().isBoolean()
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = parseInt(req.params.id);
        const updateData = req.body;
        // Benutzer kann nur sich selbst oder Admin kann alle aktualisieren
        if (req.user.userId !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unzureichende Berechtigungen' });
        }
        const updatedUser = await UserService_1.UserService.updateUser(userId, updateData);
        if (!updatedUser) {
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }
        const { password_hash, ...userResponse } = updatedUser;
        res.json({
            message: 'Benutzer erfolgreich aktualisiert',
            user: userResponse
        });
    }
    catch (error) {
        console.error('Fehler beim Aktualisieren des Benutzers:', error);
        res.status(500).json({ error: 'Fehler beim Aktualisieren des Benutzers' });
    }
});
// Benutzer löschen (nur Admin)
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)('admin'), async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const deleted = await UserService_1.UserService.deleteUser(userId);
        if (!deleted) {
            return res.status(404).json({ error: 'Benutzer nicht gefunden' });
        }
        res.json({ message: 'Benutzer erfolgreich gelöscht' });
    }
    catch (error) {
        console.error('Fehler beim Löschen des Benutzers:', error);
        res.status(500).json({ error: 'Fehler beim Löschen des Benutzers' });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map
import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { UserService } from '../services/UserService';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Registrierung
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('first_name').optional().isLength({ min: 1 }),
  body('last_name').optional().isLength({ min: 1 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userData = req.body;
    const user = await UserService.createUser(userData);

    // Passwort-Hash aus der Response entfernen
    const { password_hash, ...userResponse } = user;

    res.status(201).json({
      message: 'Benutzer erfolgreich erstellt',
      user: userResponse
    });
  } catch (error) {
    console.error('Registrierungsfehler:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Registrierung fehlgeschlagen'
    });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const loginData = req.body;
    const authResponse = await UserService.authenticateUser(loginData);

    if (!authResponse) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    res.json({
      message: 'Anmeldung erfolgreich',
      ...authResponse
    });
  } catch (error) {
    console.error('Login-Fehler:', error);
    res.status(500).json({ error: 'Anmeldung fehlgeschlagen' });
  }
});

// Aktueller Benutzer abrufen
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    const user = await UserService.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    const { password_hash, ...userResponse } = user;
    
    // ÄNDERUNG HIER: Sende userResponse direkt, nicht in einem Unterobjekt
    res.json(userResponse); 
  } catch (error) {
    console.error('Fehler beim Abrufen des Benutzers:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen des Benutzers' });
  }
});

// Alle Benutzer abrufen (nur Admin)
router.get('/', authenticateToken, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Benutzer' });
  }
});

// Benutzer aktualisieren
router.put('/:id', authenticateToken, [
  body('first_name').optional().isLength({ min: 1 }),
  body('last_name').optional().isLength({ min: 1 }),
  body('role').optional().isIn(['user', 'admin', 'moderator']),
  body('is_active').optional().isBoolean()
], async (req: AuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = parseInt(req.params.id);
    const updateData = req.body;

    // Benutzer kann nur sich selbst oder Admin kann alle aktualisieren
    if (req.user!.userId !== userId && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Unzureichende Berechtigungen' });
    }

    const updatedUser = await UserService.updateUser(userId, updateData);
    if (!updatedUser) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    const { password_hash, ...userResponse } = updatedUser;
    res.json({
      message: 'Benutzer erfolgreich aktualisiert',
      user: userResponse
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Benutzers:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Benutzers' });
  }
});

// Benutzer löschen (nur Admin)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    const deleted = await UserService.deleteUser(userId);
    if (!deleted) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    res.json({ message: 'Benutzer erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Benutzers:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Benutzers' });
  }
});

export default router;
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: 'Zugriff verweigert. Token erforderlich.' });
    return;
  }

  const decoded = UserService.verifyToken(token);
  if (!decoded) {
    res.status(403).json({ error: 'Ungültiges oder abgelaufenes Token.' });
    return;
  }

  req.user = decoded;
  next();
};

export const requireRole = (requiredRole: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
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
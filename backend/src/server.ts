import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import pool from './database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Erlaube requests ohne Origin (z.B. mobile Apps, curl requests)
    if (!origin) return callback(null, true);

    // Erlaube localhost für Entwicklung
    if (origin.includes('localhost')) return callback(null, true);

    // Erlaube die konfigurierte Frontend-URL
    const frontendUrl = process.env.FRONTEND_URL;
    if (frontendUrl && origin === frontendUrl) return callback(null, true);

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routen
app.use('/api/users', userRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Fehlerbehandlung
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Interner Serverfehler' });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route nicht gefunden' });
});

// Server starten
const server = app.listen(PORT, () => {
  console.log(`🚀 Valola Backend Server läuft auf Port ${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM erhalten, fahre Server herunter...');
  server.close(() => {
    console.log('Server heruntergefahren');
    pool.end(() => {
      console.log('Datenbankverbindungen geschlossen');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT erhalten, fahre Server herunter...');
  server.close(() => {
    console.log('Server heruntergefahren');
    pool.end(() => {
      console.log('Datenbankverbindungen geschlossen');
      process.exit(0);
    });
  });
});

export default app;
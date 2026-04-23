"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_1 = __importDefault(require("./routes/users"));
const database_1 = __importDefault(require("./database"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Erlaube requests ohne Origin (z.B. mobile Apps, curl requests)
        if (!origin)
            return callback(null, true);
        // Erlaube localhost für Entwicklung
        if (origin.includes('localhost'))
            return callback(null, true);
        // Erlaube die konfigurierte Frontend-URL
        const frontendUrl = process.env.FRONTEND_URL;
        if (frontendUrl && origin === frontendUrl)
            return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routen
app.use('/api/users', users_1.default);
// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Fehlerbehandlung
app.use((err, req, res, next) => {
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
        database_1.default.end(() => {
            console.log('Datenbankverbindungen geschlossen');
            process.exit(0);
        });
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT erhalten, fahre Server herunter...');
    server.close(() => {
        console.log('Server heruntergefahren');
        database_1.default.end(() => {
            console.log('Datenbankverbindungen geschlossen');
            process.exit(0);
        });
    });
});
exports.default = app;
//# sourceMappingURL=server.js.map
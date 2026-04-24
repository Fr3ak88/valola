const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 8000;

// Proxy API-Anfragen an das Backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  logLevel: 'debug' // Debug-Ausgabe
}));

// Serviere statische Dateien aus dem Root-Verzeichnis
app.use(express.static(path.join(__dirname)));

// Fallback: sende index.html für alle nicht-API Routen
app.get(['/', '/index.html', '/login.html', '/login-test.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Valola Frontend + API Proxy Server läuft auf Port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔗 API Proxy: http://localhost:${PORT}/api -> http://localhost:3001/api`);
});
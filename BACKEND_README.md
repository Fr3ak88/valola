# Valola Backend

Backend-API für Valola mit PostgreSQL-Datenbank.

## Technologie-Stack

- **Node.js** mit **Express.js**
- **TypeScript** für Type-Sicherheit
- **PostgreSQL** als Datenbank
- **JWT** für Authentifizierung
- **bcrypt** für Passwort-Hashing

## Schnellstart

### 1. Abhängigkeiten installieren
```bash
npm run backend:install
```

### 2. Datenbank starten
```bash
npm run db:up
```

### 3. Datenbank migrieren
```bash
npm run db:migrate
```

### 4. Testdaten hinzufügen
```bash
npm run db:seed
```

### 5. Backend starten
```bash
npm run backend:dev  # Entwicklung
# oder
npm run backend:start  # Produktion
```

### Vollständiges Setup (alles auf einmal)
```bash
npm run setup
```

## API-Endpunkte

### Authentifizierung
- `POST /api/users/register` - Benutzer registrieren
- `POST /api/users/login` - Benutzer anmelden

### Benutzer-Management (authentifiziert)
- `GET /api/users/me` - Aktueller Benutzer
- `GET /api/users` - Alle Benutzer (Admin)
- `PUT /api/users/:id` - Benutzer aktualisieren
- `DELETE /api/users/:id` - Benutzer löschen (Admin)

### Health Check
- `GET /api/health` - Server-Status

## Test-Benutzer

Nach dem Seed sind folgende Test-Benutzer verfügbar:

- **Admin**: `admin@valola.com` / `admin123`
- **User**: `test@valola.com` / `test123`

## Umgebungsvariablen

Konfiguriere die folgenden Umgebungsvariablen in `.env`:

```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=valola_dev
DB_USER=valola_user
DB_PASSWORD=valola_password
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:8000
```

## Datenbank-Schema

### users
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR UNIQUE)
- `password_hash` (VARCHAR)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `role` (VARCHAR: 'user', 'admin', 'moderator')
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### user_sessions
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER FOREIGN KEY)
- `token_hash` (VARCHAR UNIQUE)
- `expires_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

## Entwicklung

### Scripts
- `npm run backend:dev` - Entwicklungsserver mit Hot-Reload
- `npm run backend:build` - TypeScript kompilieren
- `npm run backend:start` - Produktionsserver starten

### Datenbank
- `npm run db:up` - PostgreSQL Container starten
- `npm run db:down` - PostgreSQL Container stoppen
- `npm run db:migrate` - Datenbank-Migration ausführen
- `npm run db:seed` - Testdaten einfügen
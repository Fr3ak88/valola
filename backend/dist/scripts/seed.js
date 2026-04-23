"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserService_1 = require("../services/UserService");
const database_1 = __importDefault(require("../database"));
async function seed() {
    try {
        console.log('🌱 Starte Datenbank-Seed...');
        // Admin-Benutzer erstellen
        try {
            await UserService_1.UserService.createUser({
                email: 'admin@valola.com',
                password: 'admin123',
                first_name: 'Admin',
                last_name: 'Valola',
                role: 'admin'
            });
            console.log('✅ Admin-Benutzer erstellt: admin@valola.com / admin123');
        }
        catch (error) {
            console.log('ℹ️ Admin-Benutzer existiert bereits');
        }
        // Test-Benutzer erstellen
        try {
            await UserService_1.UserService.createUser({
                email: 'test@valola.com',
                password: 'test123',
                first_name: 'Test',
                last_name: 'User',
                role: 'user'
            });
            console.log('✅ Test-Benutzer erstellt: test@valola.com / test123');
        }
        catch (error) {
            console.log('ℹ️ Test-Benutzer existiert bereits');
        }
        console.log('✅ Seed erfolgreich abgeschlossen');
    }
    catch (error) {
        console.error('❌ Seed-Fehler:', error);
        process.exit(1);
    }
    finally {
        await database_1.default.end();
    }
}
seed();
//# sourceMappingURL=seed.js.map
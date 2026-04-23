import { UserService } from '../services/UserService';
import pool from '../database';

async function seed() {
  try {
    console.log('🌱 Starte Datenbank-Seed...');

    // Admin-Benutzer erstellen
    try {
      await UserService.createUser({
        email: 'admin@valola.com',
        password: 'admin123',
        first_name: 'Admin',
        last_name: 'Valola',
        role: 'admin'
      });
      console.log('✅ Admin-Benutzer erstellt: admin@valola.com / admin123');
    } catch (error) {
      console.log('ℹ️ Admin-Benutzer existiert bereits');
    }

    // Test-Benutzer erstellen
    try {
      await UserService.createUser({
        email: 'test@valola.com',
        password: 'test123',
        first_name: 'Test',
        last_name: 'User',
        role: 'user'
      });
      console.log('✅ Test-Benutzer erstellt: test@valola.com / test123');
    } catch (error) {
      console.log('ℹ️ Test-Benutzer existiert bereits');
    }

    console.log('✅ Seed erfolgreich abgeschlossen');
  } catch (error) {
    console.error('❌ Seed-Fehler:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
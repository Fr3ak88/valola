"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../database"));
class UserService {
    static async createUser(userData) {
        const { email, password, first_name, last_name, role = 'user' } = userData;
        // E-Mail auf Existenz prüfen
        const existingUser = await this.findByEmail(email);
        if (existingUser) {
            throw new Error('Ein Benutzer mit dieser E-Mail-Adresse existiert bereits');
        }
        // Passwort hashen
        const saltRounds = 12;
        const password_hash = await bcryptjs_1.default.hash(password, saltRounds);
        const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at
    `;
        const values = [email, password_hash, first_name, last_name, role];
        const result = await database_1.default.query(query, values);
        return result.rows[0];
    }
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await database_1.default.query(query, [email]);
        return result.rows[0] || null;
    }
    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await database_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    static async updateUser(id, updateData) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        if (updateData.first_name !== undefined) {
            fields.push(`first_name = $${paramCount++}`);
            values.push(updateData.first_name);
        }
        if (updateData.last_name !== undefined) {
            fields.push(`last_name = $${paramCount++}`);
            values.push(updateData.last_name);
        }
        if (updateData.role !== undefined) {
            fields.push(`role = $${paramCount++}`);
            values.push(updateData.role);
        }
        if (updateData.is_active !== undefined) {
            fields.push(`is_active = $${paramCount++}`);
            values.push(updateData.is_active);
        }
        if (fields.length === 0) {
            return null;
        }
        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at
    `;
        values.push(id);
        const result = await database_1.default.query(query, values);
        return result.rows[0] || null;
    }
    static async deleteUser(id) {
        const query = 'DELETE FROM users WHERE id = $1';
        const result = await database_1.default.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
    static async getAllUsers() {
        const query = 'SELECT id, email, first_name, last_name, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC';
        const result = await database_1.default.query(query);
        return result.rows;
    }
    static async authenticateUser(loginData) {
        const { email, password } = loginData;
        const user = await this.findByEmail(email);
        if (!user || !user.is_active) {
            return null;
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValidPassword) {
            return null;
        }
        // JWT Token erstellen
        const token = this.generateToken(user);
        // Passwort-Hash aus der Response entfernen
        const { password_hash, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token
        };
    }
    static generateToken(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        };
        const secret = process.env.JWT_SECRET || 'fallback-secret';
        const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
        // @ts-ignore - JWT types issue with expiresIn
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
    }
    static verifyToken(token) {
        try {
            const secret = process.env.JWT_SECRET || 'fallback-secret';
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (error) {
            return null;
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map
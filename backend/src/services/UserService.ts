import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database';
import { User, CreateUserData, UpdateUserData, LoginData, AuthResponse } from '../models/User';

export class UserService {
  static async createUser(userData: CreateUserData): Promise<User> {
    const { email, password, first_name, last_name, role = 'user' } = userData;

    // E-Mail auf Existenz prüfen
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('Ein Benutzer mit dieser E-Mail-Adresse existiert bereits');
    }

    // Passwort hashen
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, password_hash, first_name, last_name, role, is_active, created_at, updated_at
    `;

    const values = [email, password_hash, first_name, last_name, role];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async updateUser(id: number, updateData: UpdateUserData): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
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
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async deleteUser(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  static async getAllUsers(): Promise<User[]> {
    const query = 'SELECT id, email, first_name, last_name, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async authenticateUser(loginData: LoginData): Promise<AuthResponse | null> {
    const { email, password } = loginData;

    const user = await this.findByEmail(email);
    if (!user || !user.is_active) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
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

  static generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    // @ts-ignore - JWT types issue with expiresIn
    return jwt.sign(payload, secret, { expiresIn });
  }

  static verifyToken(token: string): any {
    try {
      const secret = process.env.JWT_SECRET || 'fallback-secret';
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  }
}
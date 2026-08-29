const bcrypt = require('bcryptjs');
const db = require('../config/db'); // MySQL connection pool or fallback

class User {
  // Find a user by email from the Users table
  static async findByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    
    try {
      if (db && typeof db.query === 'function') {
        const [rows] = await db.query('SELECT * FROM Users WHERE email = ? LIMIT 1', [cleanEmail]);
        return rows.length > 0 ? rows[0] : null;
      }
    } catch (error) {
      console.warn('[User Model] Database query error:', error.message);
    }
    
    return null;
  }

  // Find a user by ID (excluding sensitive password hash)
  static async findById(id) {
    try {
      if (db && typeof db.query === 'function') {
        const [rows] = await db.query(
          'SELECT id, first_name, last_name, email, role, created_at, updated_at FROM Users WHERE id = ? LIMIT 1',
          [id]
        );
        return rows.length > 0 ? rows[0] : null;
      }
    } catch (error) {
      console.warn('[User Model] Database query error:', error.message);
    }

    return null;
  }

  // Create a new user record in Users table
  static async create({ firstName, lastName, email, password, role = 'sales_rep' }) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const cleanEmail = email.toLowerCase().trim();

    if (db && typeof db.query === 'function') {
      const [result] = await db.query(
        'INSERT INTO Users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        [firstName, lastName, cleanEmail, passwordHash, role]
      );
      
      return {
        id: result.insertId,
        first_name: firstName,
        last_name: lastName,
        email: cleanEmail,
        role,
      };
    }

    throw new Error('Database connection unavailable');
  }

  // Compare raw candidate password with stored bcrypt hash
  static async comparePassword(candidatePassword, hashedPassword) {
    if (!candidatePassword || !hashedPassword) return false;
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;

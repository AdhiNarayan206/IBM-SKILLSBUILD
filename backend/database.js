import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database connection
const db = new sqlite3.Database(path.join(__dirname, 'ai_study_assistant.db'));

// Initialize database tables
export const initDatabase = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Users table
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    last_login DATETIME
                )
            `);

            // User sessions table
            db.run(`
                CREATE TABLE IF NOT EXISTS sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    token TEXT UNIQUE NOT NULL,
                    expires_at DATETIME NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            `);

            // API keys table
            db.run(`
                CREATE TABLE IF NOT EXISTS user_api_keys (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    provider TEXT NOT NULL,
                    api_key TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id),
                    UNIQUE(user_id, provider)
                )
            `);

            // Doubts/queries history table
            db.run(`
                CREATE TABLE IF NOT EXISTS doubts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    filename TEXT,
                    subject TEXT,
                    question_text TEXT,
                    solution TEXT,
                    provider_used TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            `, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('✅ Database initialized successfully');
                    resolve();
                }
            });
        });
    });
};

// User operations
export const createUser = (name, email, hashedPassword) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
        stmt.run([name, email, hashedPassword], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, name, email });
            }
        });
        stmt.finalize();
    });
};

export const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

export const updateLastLogin = (userId) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [userId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

// Session operations
export const createSession = (userId, token, expiresAt) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)');
        stmt.run([userId, token, expiresAt], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID });
            }
        });
        stmt.finalize();
    });
};

export const findValidSession = (token) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT s.*, u.id as user_id, u.name, u.email 
            FROM sessions s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.token = ? AND s.expires_at > CURRENT_TIMESTAMP
        `;
        db.get(query, [token], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

export const deleteSession = (token) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM sessions WHERE token = ?', [token], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

// API keys operations
export const saveApiKey = (userId, provider, apiKey) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`
            INSERT OR REPLACE INTO user_api_keys (user_id, provider, api_key, updated_at) 
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        `);
        stmt.run([userId, provider, apiKey], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
        stmt.finalize();
    });
};

export const getUserApiKeys = (userId) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT provider, api_key FROM user_api_keys WHERE user_id = ?', [userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const apiKeys = {};
                rows.forEach(row => {
                    apiKeys[row.provider] = row.api_key;
                });
                resolve(apiKeys);
            }
        });
    });
};

// Doubts history operations
export const saveDoubt = (userId, filename, subject, questionText, solution, providerUsed) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`
            INSERT INTO doubts (user_id, filename, subject, question_text, solution, provider_used) 
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        stmt.run([userId, filename, subject, questionText, solution, providerUsed], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID });
            }
        });
        stmt.finalize();
    });
};

export const getUserDoubts = (userId, limit = 20) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM doubts 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT ?
        `;
        db.all(query, [userId, limit], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

export default db;

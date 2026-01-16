const sqlite3 = require('sqlite3').verbose();

// Create database connection
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Initialize database tables
function initializeDatabase() {
    // Create users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            rol TEXT DEFAULT 'user',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        }
    });

    // Create exams table
    db.run(`
        CREATE TABLE IF NOT EXISTS exams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            questions TEXT NOT NULL,
            max_attempts INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating exams table:', err.message);
        } else {
            // Add max_attempts column if it doesn't exist (for existing databases)
            db.run(`ALTER TABLE exams ADD COLUMN max_attempts INTEGER DEFAULT 1`, (alterErr) => {
                if (alterErr && !alterErr.message.includes('duplicate column name')) {
                    console.error('Error adding max_attempts column:', alterErr.message);
                }
            });
        }
    });

    // Create exam_results table
    db.run(`
        CREATE TABLE IF NOT EXISTS exam_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userName TEXT NOT NULL,
            title TEXT NOT NULL,
            score INTEGER NOT NULL,
            totalQuestions INTEGER NOT NULL,
            date TEXT DEFAULT CURRENT_TIMESTAMP,
            answers TEXT
        )
    `, (err) => {
        if (err) {
            console.error('Error creating exam_results table:', err.message);
        }
    });

    // Create certificate_configs table
    db.run(`
        CREATE TABLE IF NOT EXISTS certificate_configs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            config_key TEXT UNIQUE NOT NULL,
            config_value TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating certificate_configs table:', err.message);
        }
    });
}

module.exports = db;
module.exports.initializeDatabase = initializeDatabase;

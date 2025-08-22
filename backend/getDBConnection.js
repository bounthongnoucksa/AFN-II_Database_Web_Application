import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to get database connection
export function getDBConnection() {
    const dbPath = path.join(__dirname, 'ME_Database.db');

    const db = new sqlite3.Database(
        dbPath,
        sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, // allow creating if not exists
        (err) => {
            if (err) {
                console.error('Database connection error:', err.message);
            } else {
                console.log('Connected to SQLite database.');
            }
        }
    );

    return db;
}
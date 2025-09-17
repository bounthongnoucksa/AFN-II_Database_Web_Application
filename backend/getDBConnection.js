//backend/getDBConnection.js
//import 'dotenv/config'; // Load environment variables from .env file
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';




// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load the .env file from backend folder
dotenv.config({ path: path.join(__dirname, '.env') });

// Detect environment
const isDev = process.env.NODE_ENV === 'development';
console.log('ENV mode found: ', process.env.NODE_ENV);




// Helper to get database connection
export function getDBConnection() {
    let dbPath;
    if (isDev) {
        console.log('Running in development mode');
        dbPath = path.join(__dirname, 'database/ME_Database.db');
    } else {
        console.log('Running in production mode');

        const resourcesPath = process.resourcesPath || path.resolve(__dirname);
        dbPath = path.join(resourcesPath, 'database', 'ME_Database.db');

        console.log('Resources path:', resourcesPath);
    }
    console.log('Database path:', dbPath);


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
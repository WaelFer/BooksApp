import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

export const DATABASE_NAME = 'books.db';

// Open the database
export const sqlite = SQLite.openDatabaseSync(DATABASE_NAME);

// Create drizzle database instance with schema type
export const db = drizzle(sqlite, { schema });

// Initialize the database with tables
export const initDatabase = async () => {
  try {
    // Create books table
    await sqlite.execSync(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        country TEXT,
        language TEXT,
        link TEXT,
        pages INTEGER,
        publishedDate INTEGER,
        prix REAL,
        image TEXT NOT NULL
      );
    `);

    // Create carts table
    await sqlite.execSync(`
      CREATE TABLE IF NOT EXISTS carts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quantite INTEGER,
        Book_id INTEGER NOT NULL,
        FOREIGN KEY (Book_id) REFERENCES books(id)
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
};
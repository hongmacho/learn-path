import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'learn-path.db');

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!db) {
    const sqlite = new Database(dbPath);
    sqlite.pragma('journal_mode = WAL');
    db = drizzle(sqlite, { schema });
  }
  return db;
}

export { schema };

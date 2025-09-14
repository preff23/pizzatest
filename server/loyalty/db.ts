import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

const DB_PATH = process.env.LOYA_DB_PATH || path.join(process.cwd(), 'server/data/loyalty.sqlite');
const schemaPath = path.join(__dirname, 'schema.sql');

// Создаем директорию для БД если её нет
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new sqlite3.Database(DB_PATH);

// Читаем и выполняем схему БД
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

console.log(`Loyalty database initialized at: ${DB_PATH}`);

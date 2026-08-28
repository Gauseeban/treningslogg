const Database = require('better-sqlite3');
const db = new Database('treningslogg.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS okter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ovelse TEXT NOT NULL,
    vekt REAL NOT NULL, 
    reps INTEGER NOT NULL,
    sett INTEGER NOT NULL,
    dato TEXT NOT NULL 
    )
  `);

    module.exports = db;
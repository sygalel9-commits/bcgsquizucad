let db;

if (process.env.DATABASE_URL) {
  const { Pool } = require('pg');
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  db.query(`
    CREATE TABLE IF NOT EXISTS utilisateurs (
      id SERIAL PRIMARY KEY,
      nom TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      mot_de_passe TEXT NOT NULL,
      a_paye INTEGER DEFAULT 0,
      afficher_classement INTEGER DEFAULT 1,
      date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS scores (
      id SERIAL PRIMARY KEY,
      utilisateur_id INTEGER NOT NULL,
      semestre TEXT NOT NULL,
      matiere TEXT NOT NULL,
      chapitre TEXT NOT NULL,
      note REAL NOT NULL,
      mention TEXT NOT NULL,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
    );
  `).then(() => console.log("Base PostgreSQL initialisee"))
    .catch(err => console.error("Erreur init DB:", err));

} else {
  const Database = require('better-sqlite3');
  db = new Database('bcgs.db');
  db.exec(`
    CREATE TABLE IF NOT EXISTS utilisateurs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      mot_de_passe TEXT NOT NULL,
      a_paye INTEGER DEFAULT 0,
      afficher_classement INTEGER DEFAULT 1,
      date_inscription TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      utilisateur_id INTEGER NOT NULL,
      semestre TEXT NOT NULL,
      matiere TEXT NOT NULL,
      chapitre TEXT NOT NULL,
      note REAL NOT NULL,
      mention TEXT NOT NULL,
      date TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
    );
  `);
  console.log("Base SQLite locale initialisee");
}

module.exports = db;
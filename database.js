const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function initialiserDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS utilisateurs (
      id SERIAL PRIMARY KEY,
      nom TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
        mot_de_passe TEXT NOT NULL,
      a_paye BOOLEAN NOT NULL DEFAULT false,
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
  `);
  console.log("Base de donnees PostgreSQL initialisee");
}

if (process.env.DATABASE_URL) {
  initialiserDB();
} else {
  console.warn('DATABASE_URL non défini — initialisation de la base sautée. Configurez DATABASE_URL en production.');
}

module.exports = pool;
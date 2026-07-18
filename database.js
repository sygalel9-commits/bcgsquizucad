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
      motDePasse TEXT NOT NULL,
      aPaye INTEGER DEFAULT 0,
      afficherClassement INTEGER DEFAULT 1,
      dateInscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS scores (
      id SERIAL PRIMARY KEY,
      utilisateurId INTEGER NOT NULL,
      semestre TEXT NOT NULL,
      matiere TEXT NOT NULL,
      chapitre TEXT NOT NULL,
      note REAL NOT NULL,
      mention TEXT NOT NULL,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (utilisateurId) REFERENCES utilisateurs(id)
    );
  `);
  console.log("Base de donnees PostgreSQL initialisee");
}

initialiserDB();

module.exports = pool;
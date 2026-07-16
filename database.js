const Database = require('better-sqlite3');
const db = new Database('bcgs.db');

// Création des tables
db.exec(`
  CREATE TABLE IF NOT EXISTS utilisateurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    motDePasse TEXT NOT NULL,
    aPaye INTEGER DEFAULT 0,
    afficherClassement INTEGER DEFAULT 1,
    dateInscription TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    utilisateurId INTEGER NOT NULL,
    semestre TEXT NOT NULL,
    matiere TEXT NOT NULL,
    chapitre TEXT NOT NULL,
    note REAL NOT NULL,
    mention TEXT NOT NULL,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateurId) REFERENCES utilisateurs(id)
  );
`);

console.log("Base de donnees initialisee avec succes");

module.exports = db;
require('dotenv').config();
const pool = require('./database');

async function migrate() {
  try {
    console.log('🔁 Démarrage migration: renommage des colonnes vers snake_case');

    // Utilisateurs: motDePasse -> mot_de_passe
    await pool.query(`DO $$\nBEGIN\n  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='utilisateurs' AND column_name='motDePasse') THEN\n    EXECUTE 'ALTER TABLE utilisateurs RENAME COLUMN "motDePasse" TO mot_de_passe';\n  END IF;\nEND$$;`);
    console.log(' - vérifié/renommé "motDePasse" -> mot_de_passe');

    // Utilisateurs: afficherClassement -> afficher_classement
    await pool.query(`DO $$\nBEGIN\n  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='utilisateurs' AND column_name='afficherClassement') THEN\n    EXECUTE 'ALTER TABLE utilisateurs RENAME COLUMN "afficherClassement" TO afficher_classement';\n  END IF;\nEND$$;`);
    console.log(' - vérifié/renommé "afficherClassement" -> afficher_classement');

    // Scores: utilisateurId -> utilisateur_id
    await pool.query(`DO $$\nBEGIN\n  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='scores' AND column_name='utilisateurId') THEN\n    EXECUTE 'ALTER TABLE scores RENAME COLUMN "utilisateurId" TO utilisateur_id';\n  END IF;\nEND$$;`);
    console.log(' - vérifié/renommé "utilisateurId" -> utilisateur_id');

    console.log('✅ Migration terminée');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur migration:', err.message);
    process.exit(1);
  }
}

migrate();

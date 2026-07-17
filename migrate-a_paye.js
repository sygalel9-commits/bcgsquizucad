require('dotenv').config();
const pool = require('./database');

async function migrate() {
  try {
    console.log('🔁 Migration aPaye -> a_paye');

    // Renommer si la colonne existe
    await pool.query(`DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='utilisateurs' AND column_name='aPaye') THEN
    EXECUTE 'ALTER TABLE utilisateurs RENAME COLUMN "aPaye" TO a_paye';
  END IF;
END$$;`);
    console.log(' - renommage effectué si nécessaire');

    // Convertir en boolean si la colonne est encore INTEGER
    await pool.query(`DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='utilisateurs' AND column_name='a_paye' AND data_type='integer') THEN
    -- remove default first to allow cast
    EXECUTE 'ALTER TABLE utilisateurs ALTER COLUMN a_paye DROP DEFAULT';
    EXECUTE 'ALTER TABLE utilisateurs ALTER COLUMN a_paye TYPE boolean USING (a_paye = 1)';
    EXECUTE 'ALTER TABLE utilisateurs ALTER COLUMN a_paye SET DEFAULT false';
  END IF;
END$$;`);
    console.log(' - conversion en boolean effectuée si nécessaire');

    console.log('✅ Migration a_paye terminée');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur migration a_paye:', err.message);
    process.exit(1);
  }
}

migrate();

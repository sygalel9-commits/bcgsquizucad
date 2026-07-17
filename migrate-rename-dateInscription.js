require('dotenv').config();
const pool = require('./database');
(async()=>{
  try{
    console.log('🔁 Rename dateInscription -> date_inscription if present');
    await pool.query(`DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='utilisateurs' AND column_name='dateInscription') THEN
    EXECUTE 'ALTER TABLE utilisateurs RENAME COLUMN "dateInscription" TO date_inscription';
  END IF;
END$$;`);
    console.log('✅ Done');
    process.exit(0);
  }catch(err){
    console.error('❌', err.message);
    process.exit(1);
  }
})()

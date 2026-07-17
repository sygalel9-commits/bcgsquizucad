require('dotenv').config();
const pool = require('./database');

async function testConnection() {
  try {
    console.log("🔄 Test de connexion à PostgreSQL...");
    const result = await pool.query('SELECT NOW()');
    console.log("✅ Connexion réussie !");
    console.log("Heure serveur:", result.rows[0].now);
    
    // Vérifier les tables
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("📋 Tables créées:", tables.rows.map(t => t.table_name));
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur de connexion:", err.message);
    process.exit(1);
  }
}

testConnection();

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./banco.sqlite', (err) => {
  if (err) {
    console.log("Erro ao conectar ao banco de dados:", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite.");
  }
});

db.serialize(() => {

  // 1. Tabela de Usuários (Para guardar as chaves geradas)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    publicKey TEXT NOT NULL,
    privateKey TEXT NOT NULL
  )`);

  // 2. Tabela de Assinaturas (Para guardar o texto e a assinatura digital)
  db.run(`CREATE TABLE IF NOT EXISTS signatures (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    texto_original TEXT NOT NULL,
    assinatura_base64 TEXT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // 3. Tabela de Logs (Exigência da atividade)
  db.run(`CREATE TABLE IF NOT EXISTS verification_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    signature_id TEXT NOT NULL,
    resultado TEXT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  console.log("Tabelas verificadas/criadas com sucesso!");
});

module.exports = db;
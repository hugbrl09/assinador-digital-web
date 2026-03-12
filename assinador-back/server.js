const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// ROTA 1: CADASTRO E GERAÇÃO DE CHAVES
app.post('/api/signup', (req, res) => {
  const { nome, email } = req.body;

  try {
    // Gerar par de chaves RSA
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    // Salvar no banco de dados
    const sql = `INSERT INTO users (nome, email, publicKey, privateKey) VALUES (?, ?, ?, ?)`;
    db.run(sql, [nome, email, publicKey, privateKey], function (err) {
      if (err) {
        return res.status(400).json({ error: "Erro ao cadastrar ou email já existe." });
      }
      res.json({ message: "Usuário e chaves criados com sucesso!", userId: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar as chaves criptográficas." });
  }
});

// ROTA 2: ASSINATURA DO DOCUMENTO
app.post('/api/sign', (req, res) => {
  const { userId, texto } = req.body;

  db.get(`SELECT privateKey FROM users WHERE id = ?`, [Number(userId)], (err, user) => {
    if (err || !user) return res.status(404).json({ error: "Usuário não encontrado." });

    try {
      const sign = crypto.createSign('SHA256');
      sign.update(texto);
      sign.end();
      const assinaturaBase64 = sign.sign(user.privateKey, 'base64');

      // const signatureId = `sig_${crypto.randomUUID().replace(/-/g, '').substring(0, 10)}`;
      const signatureId = `sig_${crypto.randomBytes(5).toString('hex')}`;
      const sql = `INSERT INTO signatures (id, user_id, texto_original, assinatura_base64) VALUES (?, ?, ?, ?)`;

      db.run(sql, [signatureId, userId, texto, assinaturaBase64], (err) => {
        if (err) return res.status(500).json({ error: "Erro ao salvar assinatura." });
        res.json({ signatureId, message: "Documento assinado com sucesso!" });
      });
    } catch (error) {
      res.status(500).json({ error: "Erro no processo de assinatura." });
    }
  });
});

// ROTA 3: VERIFICAÇÃO PÚBLICA DA ASSINATURA
app.get('/api/verify/:id', (req, res) => {
  const signatureId = req.params.id;

  const sql = `
    SELECT s.texto_original, s.assinatura_base64, s.data_hora, u.nome, u.publicKey
    FROM signatures s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ?`;

  db.get(sql, [signatureId], (err, row) => {
    let isValid = false;

    if (row) {
      const verify = crypto.createVerify('SHA256');
      verify.update(row.texto_original);
      verify.end();
      isValid = verify.verify(row.publicKey, row.assinatura_base64, 'base64');
    }

    const resultadoTexto = isValid ? 'VÁLIDA' : 'INVÁLIDA';

    db.run(`INSERT INTO verification_logs (signature_id, resultado) VALUES (?, ?)`, [signatureId, resultadoTexto]);

    if (!row) {
      return res.json({ status: 'invalida' })
    }

    res.json({
      status: isValid ? 'valida' : 'invalida',
      nome: row.nome,
      algoritmo: 'RSA-SHA256',
      dataHora: row.data_hora
    });
  });
});

app.listen(3000, () => {
  console.log("Backend rodando na porta http://localhost:3000");
});
# 🔐 Sistema de Assinatura Digital (Custódia de Chaves)

## 🚀 Como Rodar o Projeto

### Pré-requisitos
* Node.js instalado (v16 ou superior)

### Passo 1: Backend (Node.js)
1. Abra um terminal e acesse a pasta do backend `cd assinador-back`.
2. Instale as dependências: `npm install`
3. Inicie o servidor: `node server.js`
> O banco de dados SQLite (`banco.sqlite`) será criado automaticamente, e as tabelas serão instanciadas. O servidor rodará na porta 3000.

### Passo 2: Frontend (React)
1. Abra um novo terminal e acesse a pasta do frontend.
2. Instale as dependências: `npm install`
3. Inicie a aplicação: `npm run dev`
> Acesse a interface no navegador através do link gerado (geralmente http://localhost:5173).

---

## 🛣️ Fluxo da Aplicação e Endpoints

### 1. Criação de Usuário e Chaves (POST `/api/signup`)
Gera um par de chaves RSA. A chave privada é guardada no banco e a chave pública é vinculada ao usuário.
* **Payload (Body):**
  ```json
  { "nome": "Aluno", "email": "aluno@email.com" }
  ```
* **Resposta de Sucesso:**
  ```json
  { "message": "Usuário e chaves criados com sucesso!", "userId": 1 }
  ```

### 2. Assinatura de Documento (POST `/api/sign`)
Gera um Hash SHA-256 do texto e o criptografa com a Chave Privada do usuário.
* **Payload (Body):**
  ```json
  { "userId": 1, "texto": "Documento de teste para assinatura..." }
  ```
* **Resposta de Sucesso:**
  ```json
  { "signatureId": "sig_a1b2c3d4e5", "message": "Documento assinado com sucesso!" }
  ```

### 3. Verificação Pública (GET `/api/verify/:id`)
Descriptografa a assinatura usando a Chave Pública e compara os Hashes para atestar a integridade do documento.
* **Exemplo de Rota:** `/api/verify/sig_a1b2c3d4e5`

* **Resposta de Sucesso (Status 200 - Válida):**
  ```json
  {
    "status": "valida",
    "nome": "Aluno",
    "algoritmo": "RSA-SHA256",
    "dataHora": "2026-03-11T20:30:00.000Z"
  }
  ```

## 🗄️ Banco de Dados (Dump / Migrações)
O projeto utiliza **SQLite**. Não é necessário rodar scripts manuais de migração. Ao iniciar o `server.js`, o arquivo de configuração de banco de dados (`database.js`) verifica a existência das tabelas (`users`, `signatures`, `verification_logs`) e as cria automaticamente caso não existam.

O arquivo `banco.sqlite` gerado na raiz da pasta do backend atua como o dump físico do banco, contendo os registros de teste.

## 🧪 Casos de Teste (Validação)

### Teste 1: Validação Positiva (Assinatura Íntegra)
* **Ação:** Cadastrar um usuário, acessar o dashboard, inserir um texto ("Contrato de Teste") e gerar a assinatura. Em seguida, acessar a URL de verificação gerada para aquele ID.

* **Resultado Esperado:** O sistema retorna status `200 OK`, atesta matematicamente que a assinatura confere com a chave pública armazenada e exibe na interface a mensagem de sucesso (**ASSINATURA DIGITAL VÁLIDA**).

### Teste 2: Validação Negativa (Assinatura Alterada/Forjada)
* **Ação:** Pegar o link gerado no Teste 1 (ex: `/verify/sig_12345`) e alterar manualmente o ID na barra de endereços do navegador para um valor inexistente ou modificado (ex: `/verify/sig_99999`).

* **Resultado Esperado:** O sistema não encontrará a correspondência ou a validação matemática do hash falhará. A interface capturará o erro e exibirá a mensagem de rejeição (**ASSINATURA INVÁLIDA**).
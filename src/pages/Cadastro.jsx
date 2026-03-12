import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"
import "./Cadastro.css";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/signup', { nome, email });

      const userId = response.data.userId;
      localStorage.setItem('userId', userId);

      alert(`Sucesso! Chaves geradas no servidor.\nSua ID de usuário é: ${userId}`)
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao cadastrar. O e-mail pode já estar em uso ou o servidor está offline.");
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Usuário</h2>
      <p>Cadastre-se para gerar seu par de chaves criptográficas.</p>

      <form onSubmit={handleCadastro} className="cadastro-form">
        <label htmlFor="nome">Nome:</label>
        <input 
          id="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required 
        />

        <label htmlFor="email">E-mail:</label>
        <input 
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />

        <button type="submit" className="btn-submit">
          Cadastrar e Gerar Chaves
        </button>
      </form>
    </div>
  );
}

export default Cadastro
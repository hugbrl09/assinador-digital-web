import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from "../services/api"
import './Dashboard.css';

function Dashboard() {
  const [texto, setTexto] = useState('');
  const [assinaturaId, setAssinaturaId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAssinar = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert("Erro: Você precisa fazer o cadastro primeiro!");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/sign', { userId, texto });

      setAssinaturaId(response.data.signatureId);
    } catch (error) {
      console.error("Erro ao assinar:", error);
      alert("Erro ao gerar assinatura. Verifique se o servidor está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='dashboard-container'>
      <h2>Área Autenticada</h2>
      <p>Cole o texto do documento abaixo para gerar sua assinatura digital.</p>

      <form onSubmit={handleAssinar} className='assinatura-form'>
        <textarea
          rows="8"
          placeholder='Digite ou cole o texto aqui...'
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          required
        />

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Processando...' : 'Assinar Documento'}
        </button>
      </form>

      {/* Só exibe a div de resultado se o assinaturaId existir */}
      {assinaturaId && (
        <div className="resultado-container">
          <h3>Documento Assinado com Sucesso!</h3>
          <p><strong>ID da Assinatura:</strong> {assinaturaId}</p>
          <p>
            Link público para verificação:<br/>
            <Link to={`/verify/${assinaturaId}`}>
              {window.location.origin}/verify/{assinaturaId}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard
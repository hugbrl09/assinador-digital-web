import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import './Verificacao.css';

function Verificacao() {
  const { id } = useParams();
  const [status, setStatus] = useState('carregando');
  const [dados, setDados] = useState(null);

  useEffect(() => {
    const validarAssinatura = async () => {
      try {
        const response = await api.get(`/verify/${id}`);

        setDados(response.data);
        setStatus(response.data.status);
      } catch (error) {
        console.error("Erro ao verificar assinatura:", error);
        setStatus('invalida');
      };
    }

    if (id) {
      validarAssinatura();
    }
  }, [id]);

  return (
    <div className="verify-container">
      <h2>Verificação Pública de Documento</h2>
      <p>Consultando a integridade da assinatura ID: <br/><strong>{id}</strong></p>

      {/* Renderização condicional baseada no status */}
      {status === 'carregando' && (
        <div className="status-badge loading">Consultando Banco de Dados...</div>
      )}

      {status === 'valida' && (
        <>
          <div className='status-badge valida'>Assinatura Válida</div>
          <div className='metadata'>
            <h3>Detalhes da Assinatura</h3>
            <p><strong>Signatário:</strong> {dados.nome}</p>
            <p><strong>Algoritmo:</strong> {dados.algoritmo}</p>
            <p><strong>Data e Hora:</strong> {dados.dataHora}</p>
          </div>
        </>
      )}

      {status === 'invalida' && (
        <>
          <div className='status-badge invalida'>Assinatura Inválida</div>
          <p>
            O documento foi alterado, a assinatura foi forjada ou o ID informado não existe em nosso banco de dados.
          </p>
        </>
      )}
    </div>
  );
}

export default Verificacao
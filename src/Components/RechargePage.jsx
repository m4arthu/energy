import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando o hook de navegação
import './RechargePage.css'; // Importando o CSS para o estilo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import backgroundImage from '../assets/background.png'; // Importando o background
import symbol1 from '../assets/symbol1.png'; // Importando os símbolos
import symbol2 from '../assets/symbol2.png';
import symbol3 from '../assets/symbol3.png';
import symbol4 from '../assets/symbol4.png';

const RechargePage = () => {
  const [rechargeAmount, setRechargeAmount] = useState('');
  const navigate = useNavigate(); // Hook de navegação

  // Função para lidar com a recarga
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verificar se a quantia está válida
    if (!rechargeAmount || isNaN(rechargeAmount) || rechargeAmount <= 0) {
      alert("Por favor, insira um valor válido para a recarga.");
      return;
    }

    // Obtém o saldo atual do localStorage, se existir
    let currentBalance = parseFloat(localStorage.getItem('balance')) || 0;

    // Adiciona a quantia recarregada ao saldo atual
    currentBalance += parseFloat(rechargeAmount);

    // Armazena o novo saldo no localStorage
    localStorage.setItem('balance', currentBalance);

    // Redireciona para a página principal
    navigate('/main');
  };

  return (
    <div 
      className="recharge-container"
      style={{
        backgroundImage: `url(${backgroundImage})`, // Define a imagem de fundo
        backgroundSize: 'cover', // Faz a imagem cobrir toda a tela
        backgroundPosition: 'center', // Centraliza a imagem
        minHeight: '100vh', // Garante que o background ocupe toda a altura da tela
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative' // Necessário para os símbolos serem posicionados corretamente
      }}
    >
      {/* Símbolos nos cantos */}
      <img src={symbol1} alt="Símbolo 1" className="corner-symbol top-left" />
      <img src={symbol2} alt="Símbolo 2" className="corner-symbol top-right" />
      <img src={symbol3} alt="Símbolo 3" className="corner-symbol bottom-left" />
      <img src={symbol4} alt="Símbolo 4" className="corner-symbol bottom-right" />

      <div className="recharge-card">
        {/* Ícone de seta para voltar */}
        <div className="back-button" onClick={() => navigate('/main')}>
          <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
        </div>

        <h2>Recarregar</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="amount">Por favor, insira o valor da recarga</label>
            <input
              type="text"
              id="amount"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value)}
              placeholder="R$"
            />
          </div>

          <div className="predefined-amounts">
            {[100, 250, 600, 1400, 3200].map((amount) => (
              <button
                type="button"
                key={amount}
                className="amount-button"
                onClick={() => setRechargeAmount(amount)}
              >
                {amount}
              </button>
            ))}
          </div>

          <button type="submit" className="recharge-button">
            Recarregue agora
          </button>
        </form>
        <div className="instructions">
          <p>1. Envie um novo pedido de recarga antes de cada transferência para obter o número da conta de pagamento mais recente.</p>
          <p>2. Verifique cuidadosamente as informações da conta ao transferir dinheiro para evitar erros de pagamento.</p>
          <p>3. Aguarde de 5 a 10 minutos após a conclusão da transferência. Caso não receba a recarga, envie o número da sua conta e o comprovante de pagamento.</p>
        </div>
      </div>
    </div>
  );
};

export default RechargePage;

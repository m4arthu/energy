import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WithdrawPage.css'; // Importar o CSS específico
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const WithdrawPage = () => {
  const [pixKey, setPixKey] = useState(''); // Estado para armazenar a chave PIX
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleWithdraw = (e) => {
    e.preventDefault();

    // Validação da quantia de saque
    if (!withdrawAmount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setErrorMessage('Por favor, insira um valor válido para o saque.');
      return;
    }

    // Verificar se o valor mínimo de saque foi respeitado
    if (withdrawAmount < 35) {
      setErrorMessage('O valor mínimo de saque é R$35.');
      return;
    }

    // Validar a chave PIX
    if (!pixKey) {
      setErrorMessage('Por favor, insira sua chave PIX.');
      return;
    }

    // Carregar saldo do usuário atual
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      let currentBalance = currentUser.balance;

      // Verificar se o saldo é suficiente
      const totalAfterTax = withdrawAmount * 0.92; // Imposto de 8%
      if (currentBalance < withdrawAmount) {
        setErrorMessage('Saldo insuficiente para esse saque.');
        return;
      }

      // Atualizar o saldo e armazenar as alterações
      currentBalance -= withdrawAmount;
      currentUser.balance = currentBalance;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      // Atualizar o array de usuários registrados
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      const updatedUsers = registeredUsers.map(user =>
        user.phone === currentUser.phone ? currentUser : user
      );
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

      alert(`Saque de R$${totalAfterTax.toFixed(2)} realizado com sucesso!`);

      // Redirecionar para a página principal
      navigate('/main');
    }
  };

  return (
    <div className="withdraw-container">
      <div className="withdraw-card">
        {/* Ícone de seta para voltar */}
        <div className="back-button" onClick={() => navigate('/main')}>
          <FontAwesomeIcon icon={faArrowLeft} className="back-icon" />
        </div>

        <h2>Retirar Dinheiro</h2>
        <p>Saldo da conta: R$13.00</p> {/* Substituir com o saldo real */}

        <form onSubmit={handleWithdraw}>
          {/* Campo de chave PIX */}
          <div className="input-group">
            <label htmlFor="pixKey">Insira sua chave PIX</label>
            <input
              type="text"
              id="pixKey"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="Chave PIX"
              required
            />
          </div>

          {/* Campo de valor de saque */}
          <div className="input-group">
            <label htmlFor="amount">Por favor, insira o valor do saque</label>
            <input
              type="text"
              id="amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="R$"
              required
            />
          </div>

          <p>Imposto: 8%</p>

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

          <button type="submit" className="withdraw-button">
            Retirar dinheiro agora
          </button>
        </form>

        <div className="instructions">
          <p>1. O valor mínimo de saque é R$35.</p>
          <p>2. Retire dinheiro a qualquer momento, sem restrições de horário, valor ou frequência.</p>
          <p>3. Será cobrada uma taxa de processamento de 8% aos saques.</p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;

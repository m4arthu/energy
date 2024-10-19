import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckInPage.css'; // Estilo para o check-in e a chuva de moedas

const CheckInPage = () => {
  const [lastCheckInDate, setLastCheckInDate] = useState(null);
  const [balance, setBalance] = useState(0); // Saldo da conta
  const [dailyEarnings, setDailyEarnings] = useState(0); // Renda diária acumulada
  const [canCheckIn, setCanCheckIn] = useState(true); // Controle para permitir check-in
  const [isAdmin, setIsAdmin] = useState(false); // Verifica se o usuário é admin
  const [showCoins, setShowCoins] = useState(false); // Controle para mostrar a chuva de moedas
  const navigate = useNavigate();

  useEffect(() => {
    // Carregar o usuário atual
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      navigate("/"); // Se não houver usuário logado, redireciona para a página de login
      return;
    }

    // Verifica se o usuário é admin
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      setIsAdmin(true); // Permite múltiplos check-ins para admin
    }

    // Carrega o saldo e última data de check-in
    setBalance(currentUser.balance || 0);
    setLastCheckInDate(currentUser.lastCheckInDate || null);
    setDailyEarnings(currentUser.dailyEarnings || 0);

    const today = new Date().toLocaleDateString(); // Data de hoje

    // Verifica se o usuário já fez o check-in hoje
    if (currentUser.lastCheckInDate === today && role !== 'admin') {
      setCanCheckIn(false); // Desabilita check-in se já foi feito hoje (para não-admins)
    } else {
      setCanCheckIn(true); // Permite check-in
    }
  }, [navigate]);

  const handleCheckIn = () => {
    const today = new Date().toLocaleDateString();

    // Se o check-in for permitido, adiciona R$ 1,00 ao saldo
    let newBalance = balance + 1; // Incrementa R$ 1,00 no saldo
    let newDailyEarnings = dailyEarnings + 1; // Incrementa R$ 1,00 na renda diária acumulada

    setBalance(newBalance);
    setDailyEarnings(newDailyEarnings);

    // Atualiza o saldo e a data do check-in para o usuário atual
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    currentUser.balance = newBalance;
    currentUser.dailyEarnings = newDailyEarnings;
    currentUser.lastCheckInDate = today;

    localStorage.setItem("currentUser", JSON.stringify(currentUser)); // Atualiza o usuário logado

    // Atualiza o array de usuários registrados no localStorage
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const updatedUsers = registeredUsers.map(user =>
      user.phone === currentUser.phone ? currentUser : user
    );
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

    // Ativa a chuva de moedas por 4 segundos
    setShowCoins(true);
    setTimeout(() => setShowCoins(false), 4000); // Oculta as moedas após 4 segundos

    alert('Check-in realizado com sucesso! R$1,00 adicionado ao saldo.');
    setCanCheckIn(false); // Desativa o check-in até o próximo dia
  };

  return (
    <div className="checkin-container">
      {showCoins && <div className="coin-rain"></div>} {/* Exibe a chuva de moedas */}
      <div className="checkin-card">
        <div className="back-button" onClick={() => navigate('/main')}>
          <span>&larr;</span> {/* Ícone para voltar */}
        </div>
        <h2>Check-in diário</h2>
        <p>Saldo da conta: R$ {balance.toFixed(2)}</p> {/* Mostra o saldo da conta */}
        <p>Renda diária acumulada: R$ {dailyEarnings.toFixed(2)}</p> {/* Mostra a renda diária acumulada */}

        <button
          className="checkin-button"
          onClick={handleCheckIn}
          disabled={!canCheckIn && !isAdmin} // Desabilita o check-in se não for admin e o check-in já foi feito hoje
        >
          {canCheckIn || isAdmin ? 'Check-in' : 'Check-in já realizado hoje'}
        </button>

        <div className="rules-section">
          <h4>Regras</h4>
          <ul>
            <li>Você só pode fazer check-in uma vez por dia.</li>
            <li>Cada check-in adiciona R$ 1,00 ao saldo.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;

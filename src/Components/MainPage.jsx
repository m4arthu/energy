import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './mainPage.css';
import iconUser from '../assets/user-icon.png';
import copyIcon from '../assets/copy-icon.png';  // Ícone de copiar
import solar1 from '../assets/solar1.png';  // Imagem do item 1
import solar2 from '../assets/solar2.png';  // Imagem do item 2
import solar3 from '../assets/solar3.png';  // Imagem do item 3
import midaK1 from '../assets/midaK1.png';  // Nova imagem Mida-K 1
import midaK2 from '../assets/midaK2.png';  // Nova imagem Mida-K 2
import midaK3 from '../assets/midaK3.png';  // Nova imagem Mida-K 3
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faWallet, faMoneyBillAlt, faLifeRing, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

const MainPage = () => {
  const [userCode, setUserCode] = useState("");
  const [levelProgress, setLevelProgress] = useState({ level: 1, progress: 0 });
  const [notifications, setNotifications] = useState([]);
  const [inviteLink, setInviteLink] = useState(""); // Estado para o link de convite
  const [balance, setBalance] = useState(0); // Estado para armazenar o saldo
  const navigate = useNavigate(); // Hook de navegação

  // Função para gerar um número de telefone mascarado
  const generatePhoneNumber = () => {
    const lastFourDigits = Math.floor(1000 + Math.random() * 9000); // Gera os últimos 4 dígitos
    return `*****-****${lastFourDigits}`; // Retorna o número mascarado
  };

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Carrega o usuário atual

    if (currentUser) {
      setUserCode(currentUser.userCode);

      // Gera o link de convite com o código do usuário
      const generatedLink = `https://example.com/register?inviter=${currentUser.userCode}`;
      setInviteLink(generatedLink); // Salva o link de convite no estado

      // Carrega o saldo do usuário logado
      setBalance(currentUser.balance);

      // Carrega o progresso do nível para o usuário atual
      const progressData = JSON.parse(localStorage.getItem(currentUser.userCode)) || { level: 1, progress: 0 };
      setLevelProgress(progressData);
    } else {
      navigate("/"); // Se não houver usuário logado, redireciona para a página de login
    }

    // Gera várias notificações
    const notificationList = [];
    for (let i = 0; i < 100; i++) { // Aumenta o número de notificações para garantir um fluxo contínuo
      const phoneNumber = generatePhoneNumber();
      const amount = `R$ ${Math.floor(100 + Math.random() * 2000)},00`; // Gera um valor aleatório entre 100 e 2000
      notificationList.push(`${phoneNumber} recarregou ${amount}`);
    }
    setNotifications(notificationList);
  }, [navigate]);

  // Função para copiar o link de convite para a área de transferência
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      alert("Link copiado!");
    }).catch((err) => {
      console.error('Falha ao copiar: ', err);
    });
  };

  // Função para recarregar o saldo
  const handleRecharge = (amount) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      const newBalance = currentUser.balance + amount;
      currentUser.balance = newBalance;
      setBalance(newBalance);

      // Atualiza o saldo no localStorage
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      // Atualiza também no array de usuários registrados
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
      const updatedUsers = registeredUsers.map(user =>
        user.phone === currentUser.phone ? currentUser : user
      );
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

      alert(`R$${amount} adicionados ao saldo!`);
    }
  };

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser"); // Remove o usuário atual ao deslogar
    navigate("/"); // Redireciona para a tela de login
  };

  // Função para realizar a compra e descontar do saldo
  const handlePurchase = (price) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      if (currentUser.balance >= price) {
        const newBalance = currentUser.balance - price;
        currentUser.balance = newBalance;
        setBalance(newBalance);

        // Atualiza o saldo no localStorage
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        // Atualiza também no array de usuários registrados
        const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
        const updatedUsers = registeredUsers.map(user =>
          user.phone === currentUser.phone ? currentUser : user
        );
        localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

        alert(`Compra de R$${price} realizada com sucesso!`);
      } else {
        alert('Saldo insuficiente!');
      }
    }
  };

  return (
    <div className="main-container">
      {/* Notificação no topo */}
      <div className="notification-bar">
        <div className="notification-icon">
          <FontAwesomeIcon icon={faBell} className="bell-icon" />
        </div>
        <div className="notification-wrapper">
          {notifications.concat(notifications).map((notification, index) => (
            <p key={index} className="notification-item">{notification}</p>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={iconUser} alt="User Icon" className="user-icon" />
          <span className="bronze-badge">Bronze {levelProgress.level}</span>
          {/* Barra de Nível */}
          <div className="level-bar">
            <div className="level-fill" style={{ width: `${levelProgress.progress}%` }}></div>
          </div>
        </div>
        <ul className="sidebar-menu">
          <li onClick={() => navigate('/recharge')}>
            <FontAwesomeIcon icon={faWallet} className="sidebar-icon" /> Recarregar
          </li>
          <li onClick={() => navigate('/withdraw')}>
            <FontAwesomeIcon icon={faMoneyBillAlt} className="sidebar-icon" /> Retirar Dinheiro
          </li>
          <li><FontAwesomeIcon icon={faLifeRing} className="sidebar-icon" /> Ajuda</li>
          <li onClick={() => navigate('/checkin')}>
            <FontAwesomeIcon icon={faCalendarCheck} className="sidebar-icon" /> Check-in
          </li>
        </ul>
        {/* Botão de sair */}
        <button className="logout-button" onClick={handleLogout}>Sair</button>
      </div>

      {/* Conteúdo principal */}
      <div className="main-content">
        <div className="balance-section">
          <div className="balance-info">
            <h3>Saldo: R${balance.toFixed(2)}</h3> {/* Exibe o saldo atual */}
          </div>

          {/* Barra de Copiar Link de Convite */}
          <div className="link-copy-section">
            <input type="text" value={inviteLink} readOnly />
            <button onClick={copyToClipboard}>
              <img src={copyIcon} alt="Copiar" className="copy-icon" /> {/* Ícone de copiar */}
            </button>
          </div>
        </div>

        {/* Container para as boxes de compra */}
        <div className="purchase-container">
          {/* Primeiro Card de Compra */}
          <div className="purchase-box">
            <h3>Investimento Solar (45 Placas)</h3>
            <div className="purchase-info">
              <img src={solar1} alt="Solar 1" className="purchase-image" />
              <div className="purchase-details">
                <p><strong>Preço:</strong> R$ 100</p>
                <p><strong>Período de validade:</strong> 90 dias</p>
                <p><strong>Renda diária:</strong> R$ 25</p>
                <p><strong>Receita total:</strong> R$ 2,250</p>
                <button className="purchase-button" onClick={() => handlePurchase(100)}>COMPRAR</button>
              </div>
            </div>
          </div>

          {/* Segundo Card de Compra */}
          <div className="purchase-box">
            <h3>Investimento Solar (75 Placas)</h3>
            <div className="purchase-info">
              <img src={solar2} alt="Solar 2" className="purchase-image" />
              <div className="purchase-details">
                <p><strong>Preço:</strong> R$ 250</p>
                <p><strong>Período de validade:</strong> 90 dias</p>
                <p><strong>Renda diária:</strong> R$ 66</p>
                <p><strong>Receita total:</strong> R$ 5,940</p>
                <button className="purchase-button" onClick={() => handlePurchase(250)}>COMPRAR</button>
              </div>
            </div>
          </div>

          {/* Terceiro Card de Compra */}
          <div className="purchase-box">
            <h3>Investimento Solar (150 Placas)</h3>
            <div className="purchase-info">
              <img src={solar3} alt="Solar 3" className="purchase-image" />
              <div className="purchase-details">
                <p><strong>Preço:</strong> R$ 600</p>
                <p><strong>Período de validade:</strong> 90 dias</p>
                <p><strong>Renda diária:</strong> R$ 170</p>
                <p><strong>Receita total:</strong> R$ 15,300</p>
                <button className="purchase-button" onClick={() => handlePurchase(600)}>COMPRAR</button>
              </div>
            </div>
          </div>

          {/* Novo Card 1 */}
          <div className="purchase-box">
            <h3>Investimento Solar (300 Placas)</h3>
            <div className="purchase-info">
              <img src={midaK1} alt="Mida K 1" className="purchase-image" />
              <div className="purchase-details">
                <p><strong>Preço:</strong> R$ 3,200</p>
                <p><strong>Período de validade:</strong> 90 dias</p>
                <p><strong>Renda diária:</strong> R$ 1,070</p>
                <p><strong>Receita total:</strong> R$ 96,300</p>
                <button className="purchase-button" onClick={() => handlePurchase(3200)}>COMPRAR</button>
              </div>
            </div>
          </div>

          {/* Novo Card 2 */}
          <div className="purchase-box">
            <h3>Investimento Solar (600 Placas)</h3>
            <div className="purchase-info">
              <img src={midaK2} alt="Mida K 2" className="purchase-image" />
              <div className="purchase-details">
                <p><strong>Preço:</strong> R$ 5,500</p>
                <p><strong>Período de validade:</strong> 90 dias</p>
                <p><strong>Renda diária:</strong> R$ 2,000</p>
                <p><strong>Receita total:</strong> R$ 180,000</p>
                <button className="purchase-button" onClick={() => handlePurchase(5500)}>COMPRAR</button>
              </div>
            </div>
          </div>

          {/* Novo Card 3 */}
          <div className="purchase-box">
            <h3>Investimento Solar (800 Placas)</h3>
            <div className="purchase-info">
              <img src={midaK3} alt="Mida K 3" className="purchase-image" />
              <div className="purchase-details">
                <p><strong>Preço:</strong> R$ 12,000</p>
                <p><strong>Período de validade:</strong> 90 dias</p>
                <p><strong>Renda diária:</strong> R$ 4,800</p>
                <p><strong>Receita total:</strong> R$ 432,000</p>
                <button className="purchase-button" onClick={() => handlePurchase(12000)}>COMPRAR</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MainPage;

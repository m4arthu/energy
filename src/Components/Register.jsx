import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import './login.css'; // Usando o mesmo CSS
import cartaIcon from '../assets/carta.png'; // Importando o ícone da carta
import backgroundImage from '../assets/background.png'; // Importando a imagem de fundo
import symbol1 from '../assets/symbol1.png'; // Importando os símbolos
import symbol2 from '../assets/symbol2.png';
import symbol3 from '../assets/symbol3.png';
import symbol4 from '../assets/symbol4.png';

const Register = () => {
  const [userCode, setUserCode] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [inputSecurityCode, setInputSecurityCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [inviterCode, setInviterCode] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Função para gerar um código aleatório
  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const generateSecurityCode = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  useEffect(() => {
    setUserCode(generateCode());
    setSecurityCode(generateSecurityCode());

    const inviter = searchParams.get("inviter");
    if (inviter) {
      setInviterCode(inviter);
    }
  }, [searchParams]);

  const handleRegister = (e) => {
    e.preventDefault();

    if (inputSecurityCode !== securityCode.toString()) {
      setErrorMessage("Código de segurança incorreto. Tente novamente.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não correspondem.");
      return;
    }

    const newUser = {
      phone,
      password,
      userCode,
      balance: 0 // Saldo inicial de 0 para o novo usuário
    };

    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const existingUser = registeredUsers.find(user => user.phone === phone);

    if (existingUser) {
      setErrorMessage("Este número de celular já está registrado.");
      return;
    }

    registeredUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    if (inviterCode) {
      let inviterProgress = JSON.parse(localStorage.getItem(inviterCode)) || { level: 1, progress: 0 };

      if (inviterProgress.level < 4) {
        inviterProgress.progress += 20;
      } else {
        inviterProgress.progress += 5;
      }

      if (inviterProgress.progress >= 100) {
        inviterProgress.level += 1;
        inviterProgress.progress = 0;
      }

      localStorage.setItem(inviterCode, JSON.stringify(inviterProgress));
    }

    alert("Registro bem-sucedido!");
    navigate("/main");
  };

  return (
    <div 
      className="login-container"
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

      <div className="login-card">
        <div className="back-arrow" onClick={() => navigate("/")}>
          ← Voltar
        </div>
        <div className="icon">
          <img src={cartaIcon} alt="Ícone de Conta" />
        </div>
        <form className="login-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="phone">Por favor, insira o número de celular</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+55 Insira seu número de celular"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Por favor, defina a senha de login</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Repita a senha</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita sua senha"
              required
            />
          </div>
          <div className="input-group">
            <label>Código Gerado: {userCode}</label>
          </div>
          <div className="input-group">
            <label>Código de Segurança: {securityCode}</label>
            <input
              type="text"
              id="securityCode"
              value={inputSecurityCode}
              onChange={(e) => setInputSecurityCode(e.target.value)}
              placeholder="Insira o código de segurança"
              required
            />
          </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <button type="submit" className="login-button">Registrar</button>
        </form>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css'; // Usando o CSS do login
import moedaIcon from '../assets/moeda.png'; // Importando a logo moeda.png
import backgroundImage from '../assets/background.png'; // Importando a imagem de fundo
import symbol1 from '../assets/symbol1.png'; // Importando os símbolos
import symbol2 from '../assets/symbol2.png';
import symbol3 from '../assets/symbol3.png';
import symbol4 from '../assets/symbol4.png';

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Estado para exibir mensagem de erro
  const navigate = useNavigate();

  // Função para lidar com o login
  const handleLogin = (e) => {
    e.preventDefault(); // Evita o comportamento padrão do formulário (reload da página)

    // Verificar se o usuário existe no localStorage
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const user = registeredUsers.find(user => user.phone === phone && user.password === password);

    if (user) {
      // Se o usuário existe, salvar o usuário atual e redirecionar
      localStorage.setItem("currentUser", JSON.stringify(user)); // Armazenar o usuário atual
      navigate("/main"); // Redireciona o usuário para a página principal após o login
    } else {
      // Se o usuário não existir, mostrar erro
      setErrorMessage("Número de celular ou senha incorretos, ou a conta não está registrada.");
    }
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
        <div className="icon">
          {/* Usando a imagem importada da pasta assets */}
          <img src={moedaIcon} alt="Ícone de Login" />
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="phone">Por favor, insira seu número de celular</label>
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
            <label htmlFor="password">Por favor, insira sua senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Lembre-se</label>
          </div>
          <div className="link-container">
            <a href="#" onClick={() => navigate("/register")} className="create-account">Clique para criar uma conta</a>
          </div>
          <button type="submit" className="login-button">Conecte-se</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

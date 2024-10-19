import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import MainPage from "./Components/MainPage";
import RechargePage from "./Components/RechargePage";
import CheckInPage from "./Components/CheckInPage"; // Importando a página de Check-in
import WithdrawPage from "./Components/WithdrawPage"; // Certifique-se de importar a página de retirada de dinheiro

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/recharge" element={<RechargePage />} />
        <Route path="/checkin" element={<CheckInPage />} /> {/* Adicionando a rota de check-in */}
        <Route path="/withdraw" element={<WithdrawPage />} /> {/* Adicionando a rota de retirada */}
      </Routes>
    </Router>
  );
}

export default App;

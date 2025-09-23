// src/App.jsx

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./Login";
import HomePage from "./HomePage";  // página pública, visível sem login
import Home from "./home";          // página interna depois do login
import Dashboard from "./Dashboard";
import Usuarios from "./usuarios";
import NotFound from "./NotFound";

import "./css/App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregando usuário do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        console.error("Erro ao parsear user do localStorage:", err);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Sincroniza user com localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
  };

  // Componente wrapper para rotas privadas
  const PrivateRoute = ({ children }) => {
    if (loading) {
      return <div>Carregando...</div>;  // ou componente de loading
    }
    return user ? children : <Navigate to="/" replace />;
  };

  return (
    <Router>
      <Routes>
        {/* Página pública antes do login */}
        <Route
          path="/"
          element={
            loading ? (
              <div>Carregando...</div>
            ) : user ? (
              <Navigate to="/home" replace />
            ) : (
              <HomePage onLogin={(u) => setUser(u)} />
            )
          }
        />

        {/* Login separado se tiver tela específica */}
        <Route
          path="/login"
          element={
            loading ? (
              <div>Carregando...</div>
            ) : user ? (
              <Navigate to="/home" replace />
            ) : (
              <Login user={user} setUser={setUser} />
            )
          }
        />

        {/* Página interna, só depois de login */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home user={user} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

        {/* Outras rotas privadas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard user={user} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <Usuarios user={user} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

        {/* Rota de fallback quando rota não existir */}
        <Route
          path="*"
          element={<NotFound user={user} onLogout={handleLogout} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

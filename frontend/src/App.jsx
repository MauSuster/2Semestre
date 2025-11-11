import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./Login";
import HomePage from "./HomePage";
import Home from "./home";
import Dashboard from "./Dashboard";
import Usuarios from "./usuarios";
import Equipes from "./Equipes";
import NotFound from "./NotFound";
import Eventos from "./Eventos";
import Doacoes from "./Doacoes";

import "./css/App.css";

// === Rota Privada Simples ===
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

// === Rota Privada com Restrição por Função ===
function RoleRoute({ roles, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.funcao)) return <Navigate to="/home" replace />;

  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Página pública inicial */}
      <Route
        path="/"
        element={user ? <Navigate to="/home" replace /> : <HomePage />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={user ? <Navigate to="/home" replace /> : <Login />}
      />

      {/* === Rotas privadas === */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* 🔐 Somente ADMIN */}
      <Route
        path="/usuarios"
        element={
          <RoleRoute roles={["Administrador"]}>
            <Usuarios />
          </RoleRoute>
        }
      />

      {/* 🔐 ADMIN e ORGANIZADOR */}
      <Route
        path="/equipes"
        element={
          <RoleRoute roles={["Administrador", "Organizador"]}>
            <Equipes />
          </RoleRoute>
        }
      />

      {/* 🔓 Acesso livre a todos os logados */}
      <Route
        path="/eventos"
        element={
          <RoleRoute roles={["Administrador", "Organizador"]}>
            <Eventos />
          </RoleRoute>
        }
      />

      <Route
        path="/doacoes"
        element={
          <PrivateRoute>
            <Doacoes />
          </PrivateRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

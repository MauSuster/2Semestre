// src/App.jsx
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

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  return user ? children : <Navigate to="/login" replace />;
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

      {/* Rotas privadas */}
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
      <Route
        path="/usuarios"
        element={
          <PrivateRoute>
            <Usuarios />
          </PrivateRoute>
        }
      />
      <Route
        path="/equipes"
        element={
          <PrivateRoute>
            <Equipes />
          </PrivateRoute>
        }
      />
      <Route
        path="/eventos"
        element={
          <PrivateRoute>
            <Eventos />
          </PrivateRoute>
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

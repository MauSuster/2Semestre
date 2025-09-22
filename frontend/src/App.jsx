import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Home from "./Home";
import "./css/App.css";
import NotFound from "./NotFound";
import Usuarios from "./usuarios";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // carrega usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  // salva no localStorage quando user muda
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const PrivateRoute = ({ children }) => {
    if (loading) return null; // ou um spinner
    return user ? children : <Navigate to="/" replace />;
  };

  const handleLogout = () => setUser(null);

  return (
    <Router>
      <Routes>
        {/* rota raiz / */}
        <Route
          path="/"
          element={
            loading ? null : user ? <Navigate to="/home" replace /> : <Login user={user} setUser={setUser} />
          }
        />

        {/* Home */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home user={user} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard user={user} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

        {/* Usuarios */}
        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <Usuarios user={user} onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

        {/* qualquer rota desconhecida */}
        <Route path="*" element={
         <NotFound user={user} onLogout={handleLogout} />
        } />  
      </Routes>
    </Router>
  );
}

export default App;

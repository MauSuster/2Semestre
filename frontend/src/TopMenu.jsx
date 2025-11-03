// src/TopMenu.jsx
import { Link, useNavigate } from "react-router-dom";
import "./css/TopMenu.css";
import { useAuth } from "./context/AuthContext";

export default function TopMenu({ active = "home" }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="top-menu">
      <nav className="nav-bar">
        <div className="nav-left">
          <div className="brand">DoaCore</div>
          <ul className="nav-links">
            <li className={active === "home" ? "active" : ""}>
              <Link to="/home">Home</Link>
            </li>
            <li className={active === "dashboard" ? "active" : ""}>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className={active === "usuarios" ? "active" : ""}>
              <Link to="/usuarios">Usuários</Link>
            </li>
            <li className={active === "equipes" ? "active" : ""}>
              <Link to="/equipes">Equipes</Link>
            </li>
            <li className={active === "eventos" ? "active" : ""}>
              <Link to="/eventos">Eventos</Link>
            </li>
            <li className={active === "doacoes" ? "active" : ""}>
              <Link to="/doacoes">Doações</Link>
            </li>
          </ul>
        </div>

        <div className="nav-right">
          <Link className="btn" to="/perfil">
            Perfil
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </nav>
    </header>
  );
}

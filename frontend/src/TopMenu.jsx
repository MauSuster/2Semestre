import { Link, useNavigate } from "react-router-dom";
import "./css/TopMenu.css";
import { useAuth } from "./context/AuthContext";

export default function TopMenu({ active = "home" }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="top-menu">
      <nav className="nav-bar">
        <div className="nav-left">
          <div className="brand">CQA</div>
          <ul className="nav-links">
            <li className={active === "home" ? "active" : ""}>
              <Link to="/home">Home</Link>
            </li>

            <li className={active === "dashboard" ? "active" : ""}>
              <Link to="/dashboard">Dashboard</Link>
            </li>


            {(user?.funcao === "Administrador" || user?.funcao === "Organizador") && (
              <li className={active === "equipes" ? "active" : ""}>
                <Link to="/equipes">Equipes</Link>
              </li>
            )}


            {user?.funcao === "Administrador" && (
              <li className={active === "usuarios" ? "active" : ""}>
                <Link to="/usuarios">Usuários</Link>
              </li>
            )}

      
            {(user?.funcao === "Administrador" || user?.funcao === "Organizador") && (
            <li className={active === "eventos" ? "active" : ""}>
              <Link to="/eventos">Eventos</Link>
            </li>

            )}

            <li className={active === "doacoes" ? "active" : ""}>
              <Link to="/doacoes">Doações</Link>
            </li>
          </ul>
        </div>

        <div className="nav-right">
          <div className="user-info">
            <span className="user-name">{user?.nome}</span>
            <span className="user-role">{user?.funcao}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </nav>
    </header>
  );
}

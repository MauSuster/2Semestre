import { Link } from "react-router-dom";
import "./css/TopMenu.css";


export default function TopMenu({ onLogout, active = "home" }) {
  return (
    <header className="top-menu">
      <nav className="nav-bar">
        <div className="nav-left">
          <div className="brand">DoaDash</div>
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
          </ul>
        </div>
        <div className="nav-right">
          <button className="profile-btn">Perfil</button>
          <button className="logout-btn" onClick={onLogout}>Sair</button>
        </div>
      </nav>
    </header>
  );
}

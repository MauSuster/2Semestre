/* Home.jsx */
import React from "react";
import "./css/Home.css"; // seu CSS separado para home
import TopMenu from "./TopMenu"; // import default igual no Dashboard

export default function Home({ user, onLogout }) {
  return (
    <div className="home-container">
      <TopMenu onLogout={onLogout} active="home" />
      <main>
        <section className="welcome-card">
          <h1>Bem-vindo, {user?.name || "Usuário"}!</h1>
          <p>
            Aqui você pode acompanhar suas métricas de doações e acessar rapidamente o dashboard.
          </p>
        </section>

        <section className="quick-links">
          <div className="card">
            <h3>Minhas Doações</h3>
            <p>Acompanhe suas contribuições em tempo real.</p>
          </div>
          <div className="card">
            <h3>Campanhas</h3>
            <p>Veja as campanhas ativas e participe.</p>
          </div>
          <div className="card">
            <h3>Configurações</h3>
            <p>Gerencie seu perfil e preferências.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

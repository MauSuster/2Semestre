import React from "react";
import "./css/Home.css";
import TopMenu from "./TopMenu";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home({ user, onLogout }) {
  return (
    <div className="home-container">
      <TopMenu onLogout={onLogout} active="home" />

      <main className="home-main">
        <motion.div
          className="home-content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* BOAS-VINDAS */}
          <section className="welcome-card">
            <h1>Olá, {user?.nome || "Usuário"} 👋</h1>
            <p>
              Bem-vindo ao seu painel! Aqui você acompanha suas doações, participa de campanhas e vê o impacto real da sua contribuição.
            </p>
          </section>

          {/* MÉTRICAS RÁPIDAS */}
          <section className="stats-section">
            <div className="stat-card">
              <h2>15</h2>
              <p>Doações Realizadas</p>
            </div>
            <div className="stat-card">
              <h2>3</h2>
              <p>Campanhas Ativas</p>
            </div>
            <div className="stat-card">
              <h2>28kg</h2>
              <p>Alimentos Arrecadados</p>
            </div>
          </section>

          {/* ATALHOS */}
          <section className="quick-links">
            <Link to="/dashboard" className="card-link">
              <div className="card">
                <h3>📊 Dashboard</h3>
                <p>Veja o desempenho geral e estatísticas do projeto.</p>
              </div>
            </Link>
            <Link to="/usuarios" className="card-link">
              <div className="card">
                <h3>👥 Usuários</h3>
                <p>Gerencie e acompanhe os voluntários cadastrados.</p>
              </div>
            </Link>
            <Link to="/equipes" className="card-link">
              <div className="card">
                <h3>🤝 Equipes</h3>
                <p>Visualize as equipes de arrecadação e seus progressos.</p>
              </div>
            </Link>
          </section>

          {/* CAMPANHAS */}
          <section className="campaign-section">
            <h2>Campanhas Recentes</h2>
            <div className="campaign-list">
              <div className="campaign-card">
                <h4>Campanha de Natal</h4>
                <p>Doe alimentos e brinquedos até 20/12.</p>
                <button className="btn-secondary">Participar</button>
              </div>
              <div className="campaign-card">
                <h4>Mutirão Solidário</h4>
                <p>Recolha de cestas básicas em parceria com o SESC.</p>
                <button className="btn-secondary">Saber Mais</button>
              </div>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}

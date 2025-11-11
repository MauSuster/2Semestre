import React from "react";
import "./css/Home.css";
import TopMenu from "./TopMenu";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="home-container">
      <TopMenu active="home" />

      <main className="home-main">
        <motion.div
          className="home-content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* BOAS-VINDAS */}
          <section className="welcome-card">
            <h1>
              Olá, {user?.nome || "Usuário"} 👋
            </h1>
            <p>
              Bem-vindo ao seu painel institucional da <strong>CQA</strong>!
              Aqui você acompanha suas doações, participa de campanhas e visualiza
              o impacto real da sua contribuição em tempo real.
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
                <p>Visualize as métricas e resultados das ações de doação.</p>
              </div>
            </Link>

            <Link to="/usuarios" className="card-link">
              <div className="card">
                <h3>👥 Usuários</h3>
                <p>Gerencie e acompanhe os membros e voluntários.</p>
              </div>
            </Link>

            <Link to="/equipes" className="card-link">
              <div className="card">
                <h3>🤝 Equipes</h3>
                <p>Veja as equipes de arrecadação e o progresso coletivo.</p>
              </div>
            </Link>
          </section>

          {/* CAMPANHAS RECENTES */}
          <section className="campaign-section">
            <h2>Campanhas Recentes</h2>
            <div className="campaign-list">
              <div className="campaign-card">
                <h4>Campanha de Natal 🎁</h4>
                <p>Doe alimentos e brinquedos até <strong>20/12</strong>.</p>
                <button className="btn-secondary">Participar</button>
              </div>
              <div className="campaign-card">
                <h4>Mutirão Solidário 🤝</h4>
                <p>Recolha de cestas básicas em parceria com o <strong>SESC</strong>.</p>
                <button className="btn-secondary">Saber Mais</button>
              </div>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}

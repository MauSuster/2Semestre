import React from "react";
import { Link } from "react-router-dom";
import "./css/HomePage.css";
import { motion } from "framer-motion";


function HomePage({ user, onLogout }) {
  return (
    <div className="home">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">Lideranças Empáticas</div>
        <ul className="nav-menu">
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#como-ajudar">Como Ajudar</a></li>
          <li><a href="#impacto">Impacto</a></li>
          <li><a href="#contato">Contato</a></li>
          {user ? (
            <li><button onClick={onLogout} className="nav-logout">Sair</button></li>
          ) : (
            <li><Link to="/login" className="nav-login">Entrar</Link></li>
          )}
        </ul>
      </nav>

      {/* HERO */}
      <header className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1>Unindo corações para combater a fome</h1>
          <p>
            O projeto <strong>Lideranças Empáticas</strong> conecta pessoas e
            empresas em prol de comunidades em vulnerabilidade social. Sua ajuda
            transforma vidas e inspira novas lideranças solidárias.
          </p>
          {user ? (
            <Link to="/home" className="btn-secondary">Acessar Painel</Link>
          ) : (
            <Link to="/login" className="btn">Quero Ajudar Agora</Link>
          )}
        </motion.div>
      </header>

      {/* SOBRE */}
      <main className="main">
        <section id="sobre" className="card">
          <h2>Sobre o Projeto</h2>
          <p>
            Acreditamos na empatia como força de transformação. Reunimos líderes,
            voluntários e parceiros para arrecadar alimentos e recursos destinados
            a famílias em todo o Brasil, promovendo solidariedade e impacto real.
          </p>
        </section>

        <section id="como-ajudar" className="card destaque">
          <h2>Como Ajudar</h2>
          <p>
            Você pode fazer parte dessa rede solidária doando alimentos,
            contribuindo financeiramente ou participando das nossas campanhas.
            Cada gesto conta!
          </p>
          <Link to="/login" className="btn-secondary">Fazer uma Doação</Link>
        </section>

        <section id="impacto" className="impacto-card">
          <h2>Nosso Impacto</h2>
          <div className="impacto-stats">
            <div className="impacto-item">
              <h3>+15</h3>
              <p>toneladas de alimentos arrecadadas</p>
            </div>
            <div className="impacto-item">
              <h3>+500</h3>
              <p>famílias beneficiadas</p>
            </div>
            <div className="impacto-item">
              <h3>+200</h3>
              <p>voluntários ativos</p>
            </div>
          </div>
        </section>

        <section id="contato" className="card">
          <h2>Entre em Contato</h2>
          <p>
            Quer se juntar à causa? Envie um e-mail para{" "}
            <a href="mailto:contato@liderancasempaticas.org">
              contato@liderancasempaticas.org
            </a>{" "}
            e saiba como fazer parte dessa rede de empatia.
          </p>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} Lideranças Empáticas — Unidos por um
          Brasil mais solidário 💜
        </p>
      </footer>

      {/* BOTÃO FIXO */}
      {!user && (
        <Link to="/login" className="floating-cta">
          ❤️ Quero Ajudar
        </Link>
      )}
    </div>
  );
}

export default HomePage;

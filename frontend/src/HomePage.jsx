import React from "react";
import { Link } from "react-router-dom";
import "./css/HomePage.css";

function HomePage({ user, onLogout }) {
  return (
    <div className="home-root">
      <header className="hero">
        <nav className="nav">
          <div className="brand">Lideranças Empáticas</div>
          <ul className="nav-links">
            <li><Link to="/">Login</Link></li>
            <li><a href="#sobre">Sobre</a></li>
            <li><a href="#funciona">Como funciona</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </nav>

        <div className="hero-content">
          <h1>Lideranças Empáticas</h1>
          <p>Transformando líderes com propósito. Junte-se a nós!</p>
          <div className="hero-cta">
            {user ? (
              <button className="btn-primary" onClick={onLogout}>Sair</button>
            ) : (
              <Link className="btn-primary" to="/login">Entrar / Inscrever-se</Link>
            )}
          </div>
        </div>
      </header>

    <main class="mainF">
        <section id="sobre" className="section about">
          <h2>Sobre o Projeto</h2>
          <p>Iniciativa que conecta líderes com propósito, promovendo aprendizado e crescimento.</p>
        </section>

        <section id="funciona" className="section funciona">
          <h2>Como Funciona</h2>
          <p>Mentorias, workshops e desenvolvimento contínuo para líderes em potencial.</p>
        </section>

        <section id="contato" className="section contact">
          <h2>Contato</h2>
          <p>Entre em contato para mais informações ou dúvidas.</p>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Lideranças Empáticas</p>
      </footer>
    </div>
  );
}

export default HomePage;

import React from "react";
import TopMenu from "./TopMenu";
import "./css/NotFound.css";

export default function NotFound({ user, onLogout }) {
  return (
    <div className="notfound-container">
      {/* Menu superior */}
      <TopMenu onLogout={onLogout} active="" />

      <main className="notfound-main">
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <p>Ops! A página que você está tentando acessar não existe.</p>
        <a href={user ? "/dashboard" : "/"}>
          <button className="notfound-button">
            {user ? "Voltar para Dashboard" : "Voltar para Login"}
          </button>
        </a>
      </main>
    </div>
  );
}

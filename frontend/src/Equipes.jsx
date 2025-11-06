import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TopMenu from "./TopMenu";
import "./css/Equipes.css";

export default function Equipes({ user, onLogout }) {
  const baseURL = "https://2-semestre-sr2r.vercel.app/api";
  const [equipes, setEquipes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [membros, setMembros] = useState({});
  const [novaEquipe, setNovaEquipe] = useState({ nome_equipe: "", descricao: "" });
  const [novoMembro, setNovoMembro] = useState({});
  const [expandida, setExpandida] = useState(null);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    carregarEquipes();
    carregarUsuarios();
  }, []);

  async function carregarEquipes() {
    const res = await fetch(`${baseURL}/equipes`);
    const data = await res.json();
    setEquipes(data);
  }

  async function carregarUsuarios() {
    const res = await fetch(`${baseURL}/users`);
    const data = await res.json();
    setUsuarios(data);
  }

  async function carregarMembros(idEquipe) {
    const res = await fetch(`${baseURL}/equipes/${idEquipe}/membros`);
    const data = await res.json();
    setMembros((prev) => ({ ...prev, [idEquipe]: data }));
  }

  function mostrarMensagem(tipo, texto) {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem(null), 3000);
  }

  async function toggleEquipe(idEquipe) {
    if (expandida === idEquipe) {
      setExpandida(null);
      return;
    }
    setExpandida(idEquipe);
    await carregarMembros(idEquipe);
  }

  async function criarEquipe(e) {
    e.preventDefault();
    if (!novaEquipe.nome_equipe.trim()) {
      mostrarMensagem("aviso", "Digite o nome da equipe.");
      return;
    }

    const res = await fetch(`${baseURL}/equipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome_equipe: novaEquipe.nome_equipe,
        descricao: novaEquipe.descricao,
        id_criador: user?.id || 2,
      }),
    });

    const data = await res.json();
    mostrarMensagem(
      res.ok ? "sucesso" : "erro",
      data.message || (res.ok ? "Equipe criada com sucesso" : "Erro ao criar equipe")
    );
    setNovaEquipe({ nome_equipe: "", descricao: "" });
    carregarEquipes();
  }

  async function excluirEquipe(idEquipe) {
    if (!window.confirm("Deseja realmente excluir esta equipe?")) return;
    const res = await fetch(`${baseURL}/equipes/${idEquipe}`, {
      method: "DELETE",
    });

    if (res.ok) {
      mostrarMensagem("sucesso", "Equipe excluída com sucesso!");
      carregarEquipes();
      if (expandida === idEquipe) setExpandida(null);
    } else {
      mostrarMensagem("erro", "Erro ao excluir equipe.");
    }
  }

  async function adicionarMembro(e, idEquipe) {
    e.preventDefault();
    const id_usuario = novoMembro[idEquipe];
    if (!id_usuario) {
      mostrarMensagem("aviso", "Selecione um usuário para adicionar.");
      return;
    }

    const jaExiste = (membros[idEquipe] || []).some(
      (m) => m.id_usuario === Number(id_usuario)
    );
    if (jaExiste) {
      mostrarMensagem("aviso", "Este usuário já faz parte da equipe.");
      return;
    }

    const res = await fetch(`${baseURL}/equipes/${idEquipe}/membros`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario }),
    });

    const data = await res.json();
    mostrarMensagem(res.ok ? "sucesso" : "erro", data.message);
    setNovoMembro((prev) => ({ ...prev, [idEquipe]: "" }));
    await carregarMembros(idEquipe);
  }

  async function removerMembro(idEquipe, idUsuario) {
    const res = await fetch(
      `${baseURL}/equipes/${idEquipe}/membros/${idUsuario}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      mostrarMensagem("sucesso", "Membro removido com sucesso!");
      await carregarMembros(idEquipe);
    } else {
      mostrarMensagem("erro", "Erro ao remover membro.");
    }
  }

  return (
    <div className="equipes-container">
      <TopMenu onLogout={onLogout} active="equipes" />
      <main className="equipes-main">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1>Gerenciamento de Equipes</h1>

          {mensagem && (
            <div className={`msg-card ${mensagem.tipo}`}>
              <p>{mensagem.texto}</p>
            </div>
          )}

          <form className="equipe-form" onSubmit={criarEquipe}>
            <input
              type="text"
              placeholder="Nome da equipe"
              value={novaEquipe.nome_equipe}
              onChange={(e) =>
                setNovaEquipe({ ...novaEquipe, nome_equipe: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Descrição"
              value={novaEquipe.descricao}
              onChange={(e) =>
                setNovaEquipe({ ...novaEquipe, descricao: e.target.value })
              }
            />
            <button type="submit">Criar Equipe</button>
          </form>

          <section className="equipes-lista">
            <table className="equipes-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Criador</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {equipes.map((eq) => (
                  <React.Fragment key={eq.id_equipe}>
                    <tr>
                      <td>{eq.id_equipe}</td>
                      <td>{eq.nome_equipe}</td>
                      <td>{eq.descricao || "—"}</td>
                      <td>{eq.criador}</td>
                      <td>
                        <button
                          className="edit"
                          onClick={() => toggleEquipe(eq.id_equipe)}
                        >
                          {expandida === eq.id_equipe
                            ? "Fechar"
                            : "Ver membros"}
                        </button>
                        <button
                          className="delete"
                          onClick={() => excluirEquipe(eq.id_equipe)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>

                    {expandida === eq.id_equipe && (
                      <tr className="expand-row">
                        <td colSpan="5">
                          <div className="expand-content">
                            <h3>Membros da equipe #{eq.id_equipe}</h3>

                            <form
                              className="membro-form"
                              onSubmit={(e) => adicionarMembro(e, eq.id_equipe)}
                            >
                              <select
                                value={novoMembro[eq.id_equipe] || ""}
                                onChange={(e) =>
                                  setNovoMembro((prev) => ({
                                    ...prev,
                                    [eq.id_equipe]: e.target.value,
                                  }))
                                }
                              >
                                <option value="">Selecionar usuário...</option>
                                {usuarios.map((u) => (
                                  <option key={u.id} value={u.id}>
                                    {u.nome} {u.sobrenome} — {u.email}
                                  </option>
                                ))}
                              </select>
                              <button type="submit">Adicionar</button>
                            </form>

                            <table className="membros-table">
                              <thead>
                                <tr>
                                  <th>ID Usuário</th>
                                  <th>Nome</th>
                                  <th>Função</th>
                                  <th>Email</th>
                                  <th>Ações</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(membros[eq.id_equipe] || []).length === 0 ? (
                                  <tr>
                                    <td
                                      colSpan="5"
                                      style={{
                                        textAlign: "center",
                                        color: "#6b7280",
                                      }}
                                    >
                                      Nenhum membro nesta equipe.
                                    </td>
                                  </tr>
                                ) : (
                                  membros[eq.id_equipe].map((m) => (
                                    <tr key={m.id_usuario}>
                                      <td>{m.id_usuario}</td>
                                      <td>
                                        {m.nome} {m.sobrenome}
                                      </td>
                                      <td>{m.funcao_na_equipe}</td>
                                      <td>{m.email}</td>
                                      <td>
                                        <button
                                          className="delete"
                                          onClick={() =>
                                            removerMembro(eq.id_equipe, m.id_usuario)
                                          }
                                        >
                                          Remover
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </section>
        </motion.div>
      </main>
    </div>
  );
}

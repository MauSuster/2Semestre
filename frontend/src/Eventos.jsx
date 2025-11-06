import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TopMenu from "./TopMenu";
import "./css/Eventos.css";

export default function Eventos({ user, onLogout }) {
  const [eventos, setEventos] = useState([]);
  const [novoEvento, setNovoEvento] = useState({
    nome_evento: "",
    descricao: "",
    data_inicio: "",
    data_fim: "",
    local: "",
  });
  const [mensagem, setMensagem] = useState(null);

  const baseURL = "https://2-semestre-sr2r.vercel.app/api";

  useEffect(() => {
    carregarEventos();
  }, []);

  const carregarEventos = async () => {
    const res = await fetch(`${baseURL}/eventos`);
    const data = await res.json();
    setEventos(data);
  };

  const criarEvento = async (e) => {
    e.preventDefault();
    if (!novoEvento.nome_evento || !novoEvento.data_inicio)
      return setMensagem({ tipo: "erro", texto: "Preencha os campos obrigatórios" });

    const res = await fetch(`${baseURL}/eventos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...novoEvento, id_organizador: user?.id || 2 }),
    });

    const data = await res.json();
    if (res.ok) {
      setMensagem({ tipo: "sucesso", texto: "Evento criado com sucesso!" });
      setNovoEvento({ nome_evento: "", descricao: "", data_inicio: "", data_fim: "", local: "" });
      carregarEventos();
    } else setMensagem({ tipo: "erro", texto: data.message });
  };

  const excluirEvento = async (id) => {
    if (!window.confirm("Excluir este evento?")) return;
    const res = await fetch(`${baseURL}/eventos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMensagem({ tipo: "sucesso", texto: "Evento excluído" });
      carregarEventos();
    } else setMensagem({ tipo: "erro", texto: "Erro ao excluir evento" });
  };

  return (
    <div className="eventos-container">
      <TopMenu onLogout={onLogout} active="eventos" />
      <main className="eventos-main">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1>Gerenciamento de Eventos</h1>

          {mensagem && <div className={`msg-card ${mensagem.tipo}`}>{mensagem.texto}</div>}

          <form className="evento-form" onSubmit={criarEvento}>
            <input type="text" placeholder="Nome do evento" value={novoEvento.nome_evento}
              onChange={e => setNovoEvento({ ...novoEvento, nome_evento: e.target.value })} />
            <input type="text" placeholder="Local" value={novoEvento.local}
              onChange={e => setNovoEvento({ ...novoEvento, local: e.target.value })} />
            <div className="date-fields">
              <label>Início</label>
              <input type="date" value={novoEvento.data_inicio}
                onChange={e => setNovoEvento({ ...novoEvento, data_inicio: e.target.value })} />
              <label>Fim</label>
              <input type="date" value={novoEvento.data_fim}
                onChange={e => setNovoEvento({ ...novoEvento, data_fim: e.target.value })} />
            </div>
            <textarea placeholder="Descrição" value={novoEvento.descricao}
              onChange={e => setNovoEvento({ ...novoEvento, descricao: e.target.value })} />
            <button type="submit">Criar Evento</button>
          </form>

          <section className="eventos-lista">
            {eventos.length === 0 ? (
              <p className="sem-eventos">Nenhum evento cadastrado</p>
            ) : (
              <table className="eventos-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Local</th>
                    <th>Início</th>
                    <th>Fim</th>
                    <th>Organizador</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {eventos.map(ev => (
                    <tr key={ev.id_evento}>
                      <td>{ev.nome_evento}</td>
                      <td>{ev.local}</td>
                      <td>{ev.data_inicio?.split("T")[0]}</td>
                      <td>{ev.data_fim?.split("T")[0] || "—"}</td>
                      <td>{ev.organizador}</td>
                      <td>
                        <button className="delete" onClick={() => excluirEvento(ev.id_evento)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </motion.div>
      </main>
    </div>
  );
}

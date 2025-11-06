import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TopMenu from "./TopMenu";
import "./css/Doacoes.css";

export default function Doacoes({ user, onLogout }) {
  const baseURL = "https://2-semestre-sr2r.vercel.app/api"; 
  const [doacoes, setDoacoes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [nova, setNova] = useState({
    id_evento: "",
    tipo_doacao: "dinheiro",
    valor: "",
    observacoes: "",
    itens: [],
  });
  const [mensagem, setMensagem] = useState(null);
  const [novoItem, setNovoItem] = useState({ nome_item: "", quantidade: "", unidade: "un" });

  // === Carregar dados ===
  useEffect(() => {
    carregarDoacoes();
    carregarEventos();
  }, []);

  async function carregarDoacoes() {
    const res = await fetch(`${baseURL}/doacoes`);
    const data = await res.json();
    setDoacoes(data);
  }

  async function carregarEventos() {
    const res = await fetch(`${baseURL}/eventos`);
    const data = await res.json();
    setEventos(data);
  }

  // === Adicionar item à lista de alimentos ===
  const adicionarItem = (e) => {
    e.preventDefault();
    if (!novoItem.nome_item || !novoItem.quantidade)
      return setMensagem({ tipo: "erro", texto: "Preencha os campos do item" });
    setNova({ ...nova, itens: [...nova.itens, novoItem] });
    setNovoItem({ nome_item: "", quantidade: "", unidade: "un" });
  };

  // === Criar nova doação ===
  const criarDoacao = async (e) => {
    e.preventDefault();
    if (!nova.id_evento || !nova.tipo_doacao)
      return setMensagem({ tipo: "erro", texto: "Selecione o evento e tipo" });

    try {
      const res = await fetch(`${baseURL}/doacoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: user?.id || 2,
          id_evento: nova.id_evento,
          tipo_doacao: nova.tipo_doacao,
          valor: nova.valor,
          observacoes: nova.observacoes,
          itens: nova.itens,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMensagem({ tipo: "sucesso", texto: "Doação registrada com sucesso!" });
        setNova({ id_evento: "", tipo_doacao: "dinheiro", valor: "", observacoes: "", itens: [] });
        carregarDoacoes();
      } else setMensagem({ tipo: "erro", texto: data.message });
    } catch (err) {
      console.error(err);
      setMensagem({ tipo: "erro", texto: "Erro ao enviar doação" });
    }
  };

  return (
    <div className="doacoes-container">
      <TopMenu onLogout={onLogout} active="doacoes" />
      <main className="doacoes-main">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1>Registro de Doações</h1>

          {mensagem && <div className={`msg-card ${mensagem.tipo}`}>{mensagem.texto}</div>}

          {/* Formulário */}
          <form className="doacao-form" onSubmit={criarDoacao}>
            <select
              value={nova.id_evento}
              onChange={(e) => setNova({ ...nova, id_evento: e.target.value })}
            >
              <option value="">Selecione o evento</option>
              {eventos.map((ev) => (
                <option key={ev.id_evento} value={ev.id_evento}>
                  {ev.nome_evento}
                </option>
              ))}
            </select>

            <div className="tipo-row">
              <label>
                <input
                  type="radio"
                  name="tipo"
                  value="dinheiro"
                  checked={nova.tipo_doacao === "dinheiro"}
                  onChange={(e) => setNova({ ...nova, tipo_doacao: e.target.value })}
                />
                Dinheiro
              </label>
              <label>
                <input
                  type="radio"
                  name="tipo"
                  value="alimento"
                  checked={nova.tipo_doacao === "alimento"}
                  onChange={(e) => setNova({ ...nova, tipo_doacao: e.target.value })}
                />
                Alimento
              </label>
            </div>

            {nova.tipo_doacao === "dinheiro" && (
              <input
                type="number"
                placeholder="Valor (R$)"
                value={nova.valor}
                onChange={(e) => setNova({ ...nova, valor: e.target.value })}
              />
            )}

            {nova.tipo_doacao === "alimento" && (
              <div className="itens-doacao">
                <div className="add-item">
                  <input
                    type="text"
                    placeholder="Nome do item"
                    value={novoItem.nome_item}
                    onChange={(e) => setNovoItem({ ...novoItem, nome_item: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Qtd."
                    value={novoItem.quantidade}
                    onChange={(e) => setNovoItem({ ...novoItem, quantidade: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Unidade"
                    value={novoItem.unidade}
                    onChange={(e) => setNovoItem({ ...novoItem, unidade: e.target.value })}
                  />
                  <button onClick={adicionarItem}>Adicionar</button>
                </div>

                {nova.itens.length > 0 && (
                  <ul className="itens-lista">
                    {nova.itens.map((item, idx) => (
                      <li key={idx}>
                        {item.quantidade} {item.unidade} de {item.nome_item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <textarea
              placeholder="Observações"
              value={nova.observacoes}
              onChange={(e) => setNova({ ...nova, observacoes: e.target.value })}
            />

            <button type="submit">Registrar Doação</button>
          </form>

          {/* Tabela */}
          <section className="doacoes-lista">
            <h2>Histórico de Doações</h2>
            {doacoes.length === 0 ? (
              <p className="sem-doacoes">Nenhuma doação registrada</p>
            ) : (
              <table className="doacoes-table">
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th>Evento</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Data</th>
                    <th>Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {doacoes.map((d) => (
                    <tr key={d.id_doacao}>
                      <td>{d.usuario}</td>
                      <td>{d.nome_evento}</td>
                      <td>{d.tipo_doacao}</td>
                      <td>{d.valor ? `R$ ${d.valor.toFixed(2)}` : "—"}</td>
                      <td>{d.data_doacao?.split("T")[0]}</td>
                      <td>{d.observacoes || "—"}</td>
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

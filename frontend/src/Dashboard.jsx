import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import "./css/dashboard.css";
import TopMenu from "./TopMenu";

const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];
const baseURL = "http://localhost:5000/api";

export default function Dashboard({ user, onLogout }) {
  const [doacoes, setDoacoes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [doacoesRes, eventosRes, usersRes] = await Promise.all([
          fetch(`${baseURL}/doacoes`).then((r) => r.json()),
          fetch(`${baseURL}/eventos`).then((r) => r.json()),
          fetch(`${baseURL}/users`).then((r) => r.json()),
        ]);
        setDoacoes(doacoesRes);
        setEventos(eventosRes);
        setUsuarios(usersRes);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) return <div className="dashboard-container"><TopMenu onLogout={onLogout} active="dashboard" /><p style={{ textAlign: "center", marginTop: "3rem" }}>Carregando...</p></div>;

  // === Cálculos ===
  const doacoesDinheiro = doacoes.filter((d) => d.tipo_doacao === "dinheiro");
  const totalArrecadado = doacoesDinheiro.reduce((sum, d) => sum + (Number(d.valor) || 0), 0);
  const totalDoadores = new Set(doacoes.map((d) => d.id_usuario)).size;
  const mediaDoacao = totalDoadores > 0 ? (totalArrecadado / totalDoadores).toFixed(2) : 0;
  const meta = 20000;
  const progresso = Math.min(100, Math.round((totalArrecadado / meta) * 100));

  // === Gráfico 1: Total por Evento ===
  const porEvento = eventos.map((ev) => {
    const total = doacoesDinheiro
      .filter((d) => d.id_evento === ev.id_evento)
      .reduce((sum, d) => sum + (Number(d.valor) || 0), 0);
    return { name: ev.nome_evento, value: total };
  });

  // === Gráfico 2: Evolução Mensal ===
  const porMes = {};
  doacoesDinheiro.forEach((d) => {
    const data = new Date(d.data_doacao);
    const mes = data.toLocaleString("pt-BR", { month: "short" });
    porMes[mes] = (porMes[mes] || 0) + Number(d.valor);
  });
  const porMesData = Object.entries(porMes).map(([month, amount]) => ({ month, amount }));

  // === Gráfico 3: Tipos de Doação ===
  const tipos = [
    { name: "Dinheiro", value: doacoes.filter((d) => d.tipo_doacao === "dinheiro").length },
    { name: "Alimento", value: doacoes.filter((d) => d.tipo_doacao === "alimento").length },
  ];

  return (
    <div className="dashboard-container">
      <TopMenu onLogout={onLogout} active="dashboard" />
      <main>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* === Cards Principais === */}
          <section className="cards-grid">
            <div className="card">
              <div className="label">Total arrecadado</div>
              <div className="value">R$ {totalArrecadado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
              <div className="small">Meta: R$ {meta.toLocaleString()} ({progresso}%)</div>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${progresso}%` }} />
              </div>
            </div>

            <div className="card">
              <div className="label">Total de doadores</div>
              <div className="value">{totalDoadores}</div>
              <div className="small">Usuários ativos: {usuarios.length}</div>
            </div>

            <div className="card">
              <div className="label">Doação média</div>
              <div className="value">R$ {mediaDoacao}</div>
              <div className="small">Base: {totalDoadores} doadores</div>
            </div>

            <div className="card">
              <div className="label">Eventos ativos</div>
              <div className="value">{eventos.length}</div>
              <div className="small">Último: {eventos[0]?.nome_evento || "Nenhum"}</div>
            </div>
          </section>

          {/* === Gráficos === */}
          <section className="charts-grid">
            <div className="chart card">
              <h3>Doações por tipo</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={tipos} dataKey="value" nameKey="name" outerRadius={80}>
                      {tipos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ReTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-large card">
              <h3>Arrecadação mensal</h3>
              <div className="chart-container-large">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={porMesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ReTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-wide card">
              <h3>Arrecadação por evento</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={porEvento}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ReTooltip />
                    <Bar dataKey="value" barSize={50}>
                      {porEvento.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}

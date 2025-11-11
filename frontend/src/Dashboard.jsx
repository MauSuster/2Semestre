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
import { useAuth } from "./context/AuthContext";

const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];
const baseURL = "https://2-semestre-sr2r.vercel.app/api";

export default function Dashboard({ onLogout }) {
  const { user } = useAuth();
  const [doacoes, setDoacoes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventoSelecionado, setEventoSelecionado] = useState("todos");

  // === Fetch inicial ===
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <TopMenu onLogout={onLogout} active="dashboard" />
        <div className="loader">Carregando dados...</div>
      </div>
    );
  }

  // === 1. Escopo de acesso ===
  let doacoesVisiveis = doacoes;
  let eventosVisiveis = eventos;

  if (user?.funcao === "Administrador") {
    // vê tudo
  } else if (user?.funcao === "Organizador") {
    const equipesUsuario = user?.equipes?.map((e) => e.id_equipe) || [];
    doacoesVisiveis = doacoes.filter((d) =>
      equipesUsuario.includes(d.id_equipe)
    );
    eventosVisiveis = eventos.filter((ev) =>
      doacoesVisiveis.some((d) => d.id_evento === ev.id_evento)
    );
  } else {
    // Membro
    const equipesUsuario = user?.equipes?.map((e) => e.id_equipe) || [];
    doacoesVisiveis = doacoes.filter((d) =>
      equipesUsuario.includes(d.id_equipe)
    );
    eventosVisiveis = eventos.filter((ev) =>
      doacoesVisiveis.some((d) => d.id_evento === ev.id_evento)
    );
  }

  // === 2. Filtro por evento ===
  const doacoesFiltradasEvento =
    eventoSelecionado === "todos"
      ? doacoesVisiveis
      : doacoesVisiveis.filter(
          (d) => String(d.id_evento) === String(eventoSelecionado)
        );

  // === 3. Cálculos ===
  const doacoesDinheiro = doacoesFiltradasEvento.filter(
    (d) => d.tipo_doacao === "dinheiro"
  );
  const totalArrecadado = doacoesDinheiro.reduce(
    (s, d) => s + (Number(d.valor) || 0),
    0
  );
  const totalDoadores = new Set(doacoesFiltradasEvento.map((d) => d.id_usuario)).size;
  const mediaDoacao =
    totalDoadores > 0 ? (totalArrecadado / totalDoadores).toFixed(2) : 0;
  const meta = 20000;
  const progresso = Math.min(100, Math.round((totalArrecadado / meta) * 100));

  // === 4. Gráficos ===

  // 📊 Arrecadação por evento
  const porEvento = eventosVisiveis.map((ev) => {
    const total = doacoesDinheiro
      .filter((d) => d.id_evento === ev.id_evento)
      .reduce((s, d) => s + (Number(d.valor) || 0), 0);
    return { name: ev.nome_evento, value: total };
  });

  // 📈 Arrecadação mensal
  const porMesMap = {};
  doacoesDinheiro.forEach((d) => {
    const data = new Date(d.data_doacao);
    const key = `${data.getFullYear()}-${data.getMonth() + 1}`;
    porMesMap[key] = (porMesMap[key] || 0) + Number(d.valor);
  });
  const porMesData = Object.entries(porMesMap)
    .map(([key, amount]) => {
      const [ano, mes] = key.split("-");
      return {
        month: new Date(ano, mes - 1).toLocaleString("pt-BR", {
          month: "short",
        }),
        amount,
      };
    })
    .sort(
      (a, b) =>
        new Date(`2024-${a.month}`) - new Date(`2024-${b.month}`)
    );

  // 🍞 Tipos de doação
  const tipos = [
    {
      name: "Dinheiro",
      value: doacoesFiltradasEvento.filter((d) => d.tipo_doacao === "dinheiro")
        .length,
    },
    {
      name: "Alimento",
      value: doacoesFiltradasEvento.filter((d) => d.tipo_doacao === "alimento")
        .length,
    },
  ];

  // === 5. Render ===
  return (
    <div className="dashboard-container">
      <TopMenu onLogout={onLogout} active="dashboard" />
      <main>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* FILTRO POR EVENTO */}
          <section className="filtro-evento">
            <label>Filtrar por evento:</label>
            <select
              value={eventoSelecionado}
              onChange={(e) => setEventoSelecionado(e.target.value)}
            >
              <option value="todos">Todos</option>
              {eventosVisiveis.map((ev) => (
                <option key={ev.id_evento} value={ev.id_evento}>
                  {ev.nome_evento}
                </option>
              ))}
            </select>
          </section>

          {/* CARDS PRINCIPAIS */}
          <section className="cards-grid">
            <div className="card">
              <div className="label">Total arrecadado</div>
              <div className="value">
                R$ {totalArrecadado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <div className="small">
                Meta: R$ {meta.toLocaleString()} ({progresso}%)
              </div>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${progresso}%` }} />
              </div>
            </div>

            <div className="card">
              <div className="label">Doadores únicos</div>
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
              <div className="value">{eventosVisiveis.length}</div>
              <div className="small">
                Último: {eventosVisiveis[0]?.nome_evento || "Nenhum"}
              </div>
            </div>
          </section>

          {/* GRÁFICOS */}
          <section className="charts-grid">
            {/* Tipos de Doação */}
            <div className="chart card">
              <h3>Doações por tipo</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tipos}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                    >
                      {tipos.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ReTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Arrecadação Mensal */}
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
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#4F46E5"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Arrecadação por Evento */}
            <div className="chart-wide card">
              <h3>Arrecadação por evento</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={porEvento}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" hide={porEvento.length > 10} />
                    <YAxis />
                    <ReTooltip />
                    <Bar dataKey="value" barSize={50}>
                      {porEvento.map((entry, index) => (
                        <Cell
                          key={`bar-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
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

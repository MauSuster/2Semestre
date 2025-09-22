/* Dashboard.tsx */
import React from "react";
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
import "./css/dashboard.css"; // importa CSS separado
import TopMenu from "./TopMenu";


const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

const donationByCategory = [
  { name: "Educação", value: 4000 },
  { name: "Saúde", value: 3000 },
  { name: "Abrigos", value: 2000 },
  { name: "Animais", value: 1500 },
  { name: "Outros", value: 800 },
];

const donationsByMonth = [
  { month: "Jan", amount: 1200 },
  { month: "Feb", amount: 2100 },
  { month: "Mar", amount: 800 },
  { month: "Apr", amount: 1600 },
  { month: "May", amount: 2500 },
  { month: "Jun", amount: 3000 },
  { month: "Jul", amount: 2800 },
  { month: "Aug", amount: 3200 },
  { month: "Sep", amount: 4000 },
];

const donationsByChannel = [
  { channel: "Online", amount: 8000 },
  { channel: "Evento", amount: 3500 },
  { channel: "Transferência", amount: 2200 },
];

export default function Dashboard({user, onLogout}) {
  const total = donationByCategory.reduce((s, c) => s + c.value, 0);
  const donors = 1284;
  const avg = (total / donors).toFixed(2);
  const goal = 20000;
  const progress = Math.min(100, Math.round((total / goal) * 100));

  return (
    <div className="dashboard-container">
      <TopMenu onLogout={onLogout} active="dashboard" />
      <main>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <section className="cards-grid">
            <div className="card">
              <div className="label">Total arrecadado</div>
              <div className="value">R$ {total.toLocaleString()}</div>
              <div className="small">Meta: R$ {goal.toLocaleString()} ({progress}%)</div>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="card">
              <div className="label">Doadores</div>
              <div className="value">{donors}</div>
              <div className="small">Novos este mês: 124</div>
            </div>

            <div className="card">
              <div className="label">Doação média</div>
              <div className="value">R$ {avg}</div>
              <div className="small">Base: {donors} doadores</div>
            </div>

            <div className="card">
              <div className="label">Campanhas ativas</div>
              <div className="value">5</div>
              <div className="small">Última: Refeição Solidária</div>
            </div>
          </section>

          <section className="charts-grid">
            <div className="chart card">
              <h3>Doações por categoria</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donationByCategory} dataKey="value" nameKey="name" outerRadius={80}>
                      {donationByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ReTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-large card">
              <h3>Arrecadação por mês</h3>
              <div className="chart-container-large">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={donationsByMonth}>
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
              <h3>Doações por canal</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={donationsByChannel}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="channel" />
                    <YAxis />
                    <ReTooltip />
                    <Bar dataKey="amount" barSize={50}>
                      {donationsByChannel.map((entry, index) => (
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

/* Dashboard.css (coloque este arquivo em src/Dashboard.css)
.dashboard-container {
  height: 100vh;
  width: 100vw;
  background-color: #f9fafb;
  padding: 2rem;
  overflow: auto;
}
.top-menu .nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}
.brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4F46E5;
}
.nav-links {
  display: flex;
  gap: 1rem;
  margin-left: 1rem;
}
.nav-links li {
  cursor: pointer;
  color: #4b5563;
}
.nav-links li.active {
  color: #4F46E5;
  font-weight: 600;
}
.nav-right button {
  margin-left: 1rem;
  padding: 0.3rem 0.75rem;
  border-radius: 0.25rem;
}
.logout-btn {
  background: #ef4444;
  color: white;
  border: none;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(200px,1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.card {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.card .label {
  font-size: 0.9rem;
  color: #6b7280;
}
.card .value {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 0.5rem;
}
.card .small {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}
.progress-bar {
  width: 100%;
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 0.25rem;
  margin-top: 0.5rem;
}
.progress {
  height: 0.5rem;
  background: linear-gradient(90deg,#4F46E5,#06B6D4);
  border-radius: 0.25rem;
}
.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media(min-width: 1024px){
  .charts-grid {
    grid-template-columns: 1fr 2fr;
  }
}
.chart-container, .chart-container-large {
  height: 260px;
}
.chart-container-large {
  height: 300px;
}
.chart-wide {
  grid-column: span 2;
}
*/
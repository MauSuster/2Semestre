import React, { useState, useEffect } from "react";
import TopMenu from "./TopMenu";
import axios from "axios";
import "./css/usuarios.css";
import { motion, AnimatePresence } from "framer-motion";

const baseURL = "https://2-semestre-sr2r.vercel.app/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    senha: "",
    funcao_id: "",
  });
  const [error, setError] = useState("");

  // Buscar usuários e funções
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersRes, funcoesRes] = await Promise.all([
        axios.get(`${baseURL}/users`),
        axios.get(`${baseURL}/funcoes`),
      ]);

      const usersWithFuncao = usersRes.data.map((u) => {
        const funcao = funcoesRes.data.find((f) => f.id === u.funcao_id);
        return { ...u, funcao_nome: funcao ? funcao.nome_funcao : "" };
      });

      setUsers(usersWithFuncao);
      setFuncoes(Array.isArray(funcoesRes.data) ? funcoesRes.data : []);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Criar usuário
  const handleCreate = async () => {
    const { nome, sobrenome, email, senha, funcao_id } = newUser;
    if (!nome || !sobrenome || !email || !senha || !funcao_id)
      return setError("Preencha todos os campos!");

    try {
      const res = await axios.post(`${baseURL}/users`, newUser);
      const funcao = funcoes.find((f) => f.id === res.data.funcao_id);
      setUsers((prev) => [
        ...prev,
        { ...res.data, funcao_nome: funcao?.nome_funcao || "" },
      ]);
      setNewUser({ nome: "", sobrenome: "", email: "", senha: "", funcao_id: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Erro ao criar usuário");
    }
  };

  const handleUpdate = async (id) => {
    const updatedUser = users.find((u) => u.id === id);
    if (!updatedUser) return setError("Usuário não encontrado");
    try {
      await axios.put(`${baseURL}/users/${id}`, updatedUser);
      fetchData();
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar usuário");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      setError("Erro ao deletar usuário");
    }
  };

  const handleChange = (id, field, value) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, [field]: value } : u))
    );
  };

  return (
    <div className="users-container">
      <TopMenu active="usuarios" />
      <main className="users-main">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="users-header">
            <h1>Gerenciamento de Usuários</h1>
            <button
              className="add-user-btn"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Fechar" : "+ Novo Usuário"}
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          {/* Formulário expansível */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                className="new-user-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="text"
                  placeholder="Nome"
                  value={newUser.nome}
                  onChange={(e) =>
                    setNewUser((p) => ({ ...p, nome: e.target.value }))
                  }
                />
                <input
                  type="text"
                  placeholder="Sobrenome"
                  value={newUser.sobrenome}
                  onChange={(e) =>
                    setNewUser((p) => ({ ...p, sobrenome: e.target.value }))
                  }
                />
                <select
                  value={newUser.funcao_id}
                  onChange={(e) =>
                    setNewUser((p) => ({ ...p, funcao_id: e.target.value }))
                  }
                >
                  <option value="">Selecione a função</option>
                  {funcoes.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome_funcao}
                    </option>
                  ))}
                </select>
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((p) => ({ ...p, email: e.target.value }))
                  }
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={newUser.senha}
                  onChange={(e) =>
                    setNewUser((p) => ({ ...p, senha: e.target.value }))
                  }
                />
                <button onClick={handleCreate} className="btn-secondary">
                  Criar Usuário
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lista de usuários */}
          {loading ? (
            <p>Carregando usuários...</p>
          ) : users.length === 0 ? (
            <p>Nenhum usuário encontrado.</p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Sobrenome</th>
                    <th>Função</th>
                    <th>Email</th>
                    <th>Senha</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <input
                          value={u.nome || ""}
                          onChange={(e) =>
                            handleChange(u.id, "nome", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={u.sobrenome || ""}
                          onChange={(e) =>
                            handleChange(u.id, "sobrenome", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <select
                          value={u.funcao_id || ""}
                          onChange={(e) =>
                            handleChange(u.id, "funcao_id", e.target.value)
                          }
                        >
                          {funcoes.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.nome_funcao}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          value={u.email || ""}
                          onChange={(e) =>
                            handleChange(u.id, "email", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="password"
                          value={u.senha || ""}
                          onChange={(e) =>
                            handleChange(u.id, "senha", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="btn-update"
                          onClick={() => handleUpdate(u.id)}
                        >
                          Atualizar
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(u.id)}
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

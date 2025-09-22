import React, { useState, useEffect } from "react";
import TopMenu from "./TopMenu";
import axios from "axios";
import "./css/usuarios.css";

export default function Users({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    nome: "",
    sobrenome: "",
    funcao: "",
    email: "",
    senha: ""
  });
  const [error, setError] = useState("");

  // Carregar usuários da API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      const usersData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.users)
        ? res.data.users
        : [];
      setUsers(usersData);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Criar novo usuário
  const handleCreate = async () => {
    const { nome, sobrenome, funcao, email, senha } = newUser;
    if (!nome || !sobrenome || !funcao || !email || !senha) return;
    try {
      const res = await axios.post("http://localhost:5000/api/users", newUser);
      setUsers(prev => [...prev, res.data]);
      setNewUser({ nome: "", sobrenome: "", funcao: "", email: "", senha: "" });
    } catch (err) {
      console.error(err);
      setError("Erro ao criar usuário");
    }
  };

  // Atualizar usuário
  const handleUpdate = async id => {
    const updatedUser = users.find(u => u.id === id);
    if (!updatedUser) return;
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, updatedUser);
      alert("Usuário atualizado!");
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar usuário");
    }
  };

  // Deletar usuário
  const handleDelete = async id => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      setError("Erro ao deletar usuário");
    }
  };

  // Atualizar estado local enquanto edita
  const handleChange = (id, field, value) => {
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, [field]: value } : u))
    );
  };

  return (
    <div className="users-container">
      <TopMenu onLogout={onLogout} active="usuarios" />

      <main className="users-main">
        <h1>Gerenciamento de Usuários</h1>

        {error && <p className="error">{error}</p>}

        {/* Formulário de novo usuário */}
        <div className="new-user">
          <input
            type="text"
            placeholder="Nome"
            value={newUser.nome}
            onChange={e =>
              setNewUser(prev => ({ ...prev, nome: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Sobrenome"
            value={newUser.sobrenome}
            onChange={e =>
              setNewUser(prev => ({ ...prev, sobrenome: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Função"
            value={newUser.funcao}
            onChange={e =>
              setNewUser(prev => ({ ...prev, funcao: e.target.value }))
            }
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={e =>
              setNewUser(prev => ({ ...prev, email: e.target.value }))
            }
          />
          <input
            type="password"
            placeholder="Senha"
            value={newUser.senha}
            onChange={e =>
              setNewUser(prev => ({ ...prev, senha: e.target.value }))
            }
          />
          <button onClick={handleCreate}>Criar Usuário</button>
        </div>

        {/* Tabela de usuários */}
        {loading ? (
          <p>Carregando usuários...</p>
        ) : users.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
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
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <input
                      value={u.nome || ""}
                      onChange={e =>
                        handleChange(u.id, "nome", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={u.sobrenome || ""}
                      onChange={e =>
                        handleChange(u.id, "sobrenome", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={u.funcao || ""}
                      onChange={e =>
                        handleChange(u.id, "funcao", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={u.email || ""}
                      onChange={e =>
                        handleChange(u.id, "email", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="password"
                      value={u.senha || ""}
                      onChange={e =>
                        handleChange(u.id, "senha", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => handleUpdate(u.id)}>Atualizar</button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(u.id)}
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

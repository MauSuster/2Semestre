import React, { useState, useEffect } from "react";
import TopMenu from "./TopMenu";
import axios from "axios";
import "./css/usuarios.css";

const baseURL = "https://twosemestre.onrender.com/api";

export default function Users({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    senha: "",
    funcao_id: ""
  });
  const [error, setError] = useState("");

  // Carregar usuários e funções
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersRes, funcoesRes] = await Promise.all([
        axios.get(`${baseURL}/users`),
        axios.get(`${baseURL}/funcoes`)
      ]);

      // Se o backend retornar funcao_id, mas você quiser mostrar o nome da função
      const usersWithFuncaoNome = usersRes.data.map(u => {
        const funcao = funcoesRes.data.find(f => f.id === u.funcao_id);
        return { ...u, funcao_nome: funcao ? funcao.nome_funcao : "" };
      });

      setUsers(usersWithFuncaoNome);
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

  // Criar novo usuário
  const handleCreate = async () => {
    const { nome, sobrenome, email, senha, funcao_id } = newUser;
    if (!nome || !sobrenome || !email || !senha || !funcao_id)
      return setError("Preencha todos os campos");

    try {
      const res = await axios.post(`${baseURL}/users`, newUser);
      const funcao = funcoes.find(f => f.id === res.data.funcao_id);
      setUsers(prev => [...prev, { ...res.data, funcao_nome: funcao?.nome_funcao || "" }]);
      setNewUser({ nome: "", sobrenome: "", email: "", senha: "", funcao_id: "" });
    } catch (err) {
      console.error(err);
      setError("Erro ao criar usuário");
    }
  };

  // Atualizar usuário
  const handleUpdate = async id => {
    const updatedUser = users.find(u => u.id === id);
    if (!updatedUser) return setError("Usuário não encontrado");

    try {
      await axios.put(`${baseURL}/users/${id}`, updatedUser);
      alert("Usuário atualizado!");
      fetchData(); // Atualiza dados para pegar nome da função atualizado
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar usuário");
    }
  };

  // Deletar usuário
  const handleDelete = async id => {
    try {
      await axios.delete(`${baseURL}/users/${id}`);
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
          <input type="text" placeholder="Nome" value={newUser.nome} onChange={e => setNewUser(prev => ({ ...prev, nome: e.target.value }))} />
          <input type="text" placeholder="Sobrenome" value={newUser.sobrenome} onChange={e => setNewUser(prev => ({ ...prev, sobrenome: e.target.value }))} />
          <select value={newUser.funcao_id} onChange={e => setNewUser(prev => ({ ...prev, funcao_id: e.target.value }))}>
            <option value="">Selecione a função</option>
            {funcoes.map(f => <option key={f.id} value={f.id}>{f.nome_funcao}</option>)}
          </select>
          <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))} />
          <input type="password" placeholder="Senha" value={newUser.senha} onChange={e => setNewUser(prev => ({ ...prev, senha: e.target.value }))} />
          <button onClick={handleCreate}>Criar Usuário</button>
        </div>

        {/* Tabela de usuários */}
        {loading ? <p>Carregando usuários...</p> :
          users.length === 0 ? <p>Nenhum usuário encontrado.</p> :
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
                  <td><input value={u.nome || ""} onChange={e => handleChange(u.id, "nome", e.target.value)} /></td>
                  <td><input value={u.sobrenome || ""} onChange={e => handleChange(u.id, "sobrenome", e.target.value)} /></td>
                  <td>
                    <select value={u.funcao_id || ""} onChange={e => handleChange(u.id, "funcao_id", e.target.value)}>
                      {funcoes.map(f => <option key={f.id} value={f.id}>{f.nome_funcao}</option>)}
                    </select>
                    
                  </td>
                  <td><input value={u.email || ""} onChange={e => handleChange(u.id, "email", e.target.value)} /></td>
                  <td><input type="password" value={u.senha || ""} onChange={e => handleChange(u.id, "senha", e.target.value)} /></td>
                  <td>
                    <button onClick={() => handleUpdate(u.id)}>Atualizar</button>
                    <button className="delete" onClick={() => handleDelete(u.id)}>Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </main>
    </div>
  );
}

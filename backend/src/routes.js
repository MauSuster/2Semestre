import { Router } from "express";
import { getPool } from "./db.js";

const r = Router();

// Rota principal
r.get("/", (_, res) => {
  res.json({ message: "API is running" });
});

// Listar todos os usuários
r.get("/users", async (_, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(
      `SELECT id, nome, sobrenome, email, senha, funcao_id FROM users ORDER BY id DESC`
    );
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
});

// Criar novo usuário
r.post("/users", async (req, res) => {
  const { nome, sobrenome, email, senha, funcao_id } = req.body;

  if (!nome || !sobrenome || !email || !senha || !funcao_id) {
    return res.status(400).json({
      message: "Nome, sobrenome, email, senha e funcao_id são obrigatórios",
    });
  }

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("nome", nome)
      .input("sobrenome", sobrenome)
      .input("email", email)
      .input("senha", senha)
      .input("funcao_id", funcao_id)
      .query(
        `INSERT INTO users (nome, sobrenome, email, senha, funcao_id)
         VALUES (@nome, @sobrenome, @email, @senha, @funcao_id);
         SELECT SCOPE_IDENTITY() AS id;`
      );

    const newId = result.recordset[0].id;
    const newUser = await pool
      .request()
      .input("id", newId)
      .query(
        `SELECT u.id, u.nome, u.sobrenome, u.email, f.nome_funcao AS funcao
         FROM users u
         JOIN funcoes f ON u.funcao_id = f.id
         WHERE u.id = @id`
      );

    res.status(201).json(newUser.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
});

// Atualizar usuário
r.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, sobrenome, email, senha, funcao_id } = req.body;

  try {
    const pool = await getPool();
    await pool
      .request()
      .input("id", id)
      .input("nome", nome)
      .input("sobrenome", sobrenome)
      .input("email", email)
      .input("senha", senha)
      .input("funcao_id", funcao_id)
      .query(
        `UPDATE users
         SET nome=@nome, sobrenome=@sobrenome, email=@email, senha=@senha, funcao_id=@funcao_id
         WHERE id=@id`
      );

    res.json({ message: "Usuário atualizado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
});

// Deletar usuário
r.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getPool();
    await pool.request().input("id", id).query("DELETE FROM users WHERE id=@id");
    res.json({ message: "Usuário deletado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao deletar usuário" });
  }
});

// Login
r.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha)
    return res.status(400).json({ message: "Email e senha são obrigatórios" });

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("email", email)
      .input("senha", senha)
      .query("SELECT * FROM users WHERE email=@email AND senha=@senha");

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Usuário ou senha incorretos" });
    }

    return res.json({ message: `Bem-vindo, ${result.recordset[0].nome}!` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro no servidor" });
  }
});

export default r;

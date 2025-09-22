import { Router } from "express";
import { pool } from "./db.js";

const r = Router();

r.get("/", (_, res) => {
  res.json({ message: "API is running" });
});

// Listar usuários
r.get("/users", async (_, res) => {
  try {
    const result = await pool.request().query(`
      SELECT id, nome, sobrenome, funcao, email 
      FROM users 
      ORDER BY id DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Criar usuário
r.post("/users", async (req, res) => {
  const { nome, sobrenome, funcao, email, senha } = req.body;

  if (!nome || !sobrenome || !funcao || !email || !senha) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    const result = await pool.request()
      .input("nome", sql.NVarChar, nome)
      .input("sobrenome", sql.NVarChar, sobrenome)
      .input("funcao", sql.NVarChar, funcao)
      .input("email", sql.NVarChar, email)
      .input("senha", sql.NVarChar, senha)
      .query(`
        INSERT INTO users (nome, sobrenome, funcao, email, senha)
        VALUES (@nome, @sobrenome, @funcao, @email, @senha);
        SELECT SCOPE_IDENTITY() AS id;
      `);

    const newId = result.recordset[0].id;

    const newUser = await pool.request()
      .input("id", sql.Int, newId)
      .query("SELECT id, nome, sobrenome, funcao, email FROM users WHERE id = @id");

    res.status(201).json(newUser.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
});

// Atualizar usuário
r.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, sobrenome, funcao, email, senha } = req.body;

  try {
    await pool.request()
      .input("id", sql.Int, id)
      .input("nome", sql.NVarChar, nome)
      .input("sobrenome", sql.NVarChar, sobrenome)
      .input("funcao", sql.NVarChar, funcao)
      .input("email", sql.NVarChar, email)
      .input("senha", sql.NVarChar, senha)
      .query(`
        UPDATE users
        SET nome=@nome, sobrenome=@sobrenome, funcao=@funcao, email=@email, senha=@senha
        WHERE id=@id
      `);

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
    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM users WHERE id=@id");

    res.json({ message: "Usuário deletado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao deletar usuário" });
  }
});

// Login
r.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Email e senha são obrigatórios" });
  }

  try {
    const result = await pool.request()
      .input("email", sql.NVarChar, email)
      .input("senha", sql.NVarChar, senha)
      .query("SELECT * FROM users WHERE email=@email AND senha=@senha");

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Usuário ou senha incorretos" });
    }

    res.json({ message: `Bem-vindo, ${result.recordset[0].nome}!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

export default r;

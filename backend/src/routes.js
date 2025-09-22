import { Router } from "express";
import { pool } from "./db.js";

const r = Router();

r.get("/", (_, res) => {
  res.json({ message: "API is running" });
});

r.get("/users", async (_, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nome, sobrenome, funcao, email FROM users ORDER BY id DESC"
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

r.post("/users", async (req, res) => {
  const { nome, sobrenome, funcao, email, senha } = req.body;

  if (!nome || !sobrenome || !funcao || !email || !senha) {
    return res
      .status(400)
      .json({ message: "Nome, sobrenome, função, email e senha são obrigatórios" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO users (nome, sobrenome, funcao, email, senha) VALUES (?, ?, ?, ?, ?)",
      [nome, sobrenome, funcao, email, senha]
    );

    const [rows] = await pool.query(
      "SELECT id, nome, sobrenome, funcao, email FROM users WHERE id = ?",
      [result.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao criar usuário" });
  }
});

r.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, sobrenome, funcao, email, senha } = req.body;
  try {
    await pool.query(
      "UPDATE users SET nome=?, sobrenome=?, funcao=?, email=?, senha=? WHERE id=?",
      [nome, sobrenome, funcao, email, senha, id]
    );
    res.json({ message: "Usuário atualizado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
});

r.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id=?", [id]);
    res.json({ message: "Usuário deletado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao deletar usuário" });
  }
});

r.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha)
    return res.status(400).json({ message: "Email e senha são obrigatórios" });

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND senha = ?",
      [email, senha]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuário ou senha incorretos" });
    }

    return res.json({ message: `Bem-vindo, ${rows[0].nome}!` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro no servidor" });
  }
});

export default r;

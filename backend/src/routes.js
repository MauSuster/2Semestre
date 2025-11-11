import { Router } from "express";
import { getPool } from "./db.js";

const r = Router();

// ==========================================
// ROTA PRINCIPAL
// ==========================================
r.get("/", (_, res) => {
  res.json({ message: "API is running" });
});

// ==========================================
// USUÁRIOS
// ==========================================

// Listar todos os usuários
r.get("/users", async (_, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT id, nome, sobrenome, email, senha, funcao_id
      FROM users
      ORDER BY id DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
});

// Criar usuário
r.post("/users", async (req, res) => {
  const { nome, sobrenome, email, senha, funcao_id } = req.body;
  if (!nome || !sobrenome || !email || !senha || !funcao_id) {
    return res.status(400).json({ message: "Campos obrigatórios ausentes" });
  }

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("nome", nome)
      .input("sobrenome", sobrenome)
      .input("email", email)
      .input("senha", senha)
      .input("funcao_id", funcao_id)
      .query(`
        INSERT INTO users (nome, sobrenome, email, senha, funcao_id)
        VALUES (@nome, @sobrenome, @email, @senha, @funcao_id);
        SELECT * FROM users WHERE id = SCOPE_IDENTITY();
      `);
    res.status(201).json(result.recordset[0]);
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
    await pool.request()
      .input("id", id)
      .input("nome", nome)
      .input("sobrenome", sobrenome)
      .input("email", email)
      .input("senha", senha)
      .input("funcao_id", funcao_id)
      .query(`
        UPDATE users
        SET nome=@nome, sobrenome=@sobrenome, email=@email, senha=@senha, funcao_id=@funcao_id
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
  try {
    const pool = await getPool();
    await pool.request().input("id", req.params.id).query("DELETE FROM users WHERE id=@id");
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
      .query(`
        SELECT u.id, u.nome, u.sobrenome, u.email, u.funcao_id, f.nome_funcao
        FROM users u
        JOIN funcoes f ON f.id = u.funcao_id
        WHERE u.email=@email AND u.senha=@senha
      `);

    if (result.recordset.length === 0)
      return res.status(401).json({ message: "Usuário ou senha incorretos" });

    const user = result.recordset[0];

    // Buscar equipes do usuário
    const equipesRes = await pool
      .request()
      .input("id_usuario", user.id)
      .query(`
        SELECT e.id_equipe, e.nome_equipe, e.descricao
        FROM usuarios_equipes ue
        JOIN equipes e ON e.id_equipe = ue.id_equipe
        WHERE ue.id_usuario = @id_usuario
      `);

    const equipes = equipesRes.recordset || [];

    return res.json({
      id: user.id,
      nome: user.nome,
      sobrenome: user.sobrenome,
      email: user.email,
      funcao: user.nome_funcao,
      funcao_id: user.funcao_id,
      equipes
    });
  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ message: "Erro no servidor" });
  }
});


// ==========================================
// FUNÇÕES
// ==========================================
r.get("/funcoes", async (_, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT id, nome_funcao FROM funcoes ORDER BY id");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar funções" });
  }
});

// ==========================================
// EQUIPES
// ==========================================

// Listar equipes
r.get("/equipes", async (_, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT e.id_equipe, e.nome_equipe, e.descricao, e.data_criacao,
             u.nome + ' ' + u.sobrenome AS criador
      FROM equipes e
      JOIN users u ON u.id = e.id_criador
      ORDER BY e.data_criacao DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar equipes" });
  }
});

// Criar equipe
r.post("/equipes", async (req, res) => {
  const { nome_equipe, descricao, id_criador } = req.body;
  if (!nome_equipe || !id_criador)
    return res.status(400).json({ message: "Campos obrigatórios ausentes" });

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("nome_equipe", nome_equipe)
      .input("descricao", descricao || "")
      .input("id_criador", id_criador)
      .query(`
        INSERT INTO equipes (nome_equipe, descricao, id_criador)
        VALUES (@nome_equipe, @descricao, @id_criador);
        SELECT * FROM equipes WHERE id_equipe = SCOPE_IDENTITY();
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar equipe" });
  }
});

// Excluir equipe
r.delete("/equipes/:id", async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request().input("id", req.params.id).query("DELETE FROM equipes WHERE id_equipe=@id");
    res.json({ message: "Equipe excluída" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao excluir equipe" });
  }
});

// Listar membros
r.get("/equipes/:id/membros", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().input("id_equipe", req.params.id).query(`
      SELECT ue.id_usuario, u.nome, u.sobrenome, u.email, ue.funcao_na_equipe
      FROM usuarios_equipes ue
      JOIN users u ON ue.id_usuario = u.id
      WHERE ue.id_equipe=@id_equipe
      ORDER BY u.nome
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar membros" });
  }
});

// Adicionar membro
r.post("/equipes/:id/membros", async (req, res) => {
  const { id } = req.params;
  const { id_usuario, funcao_na_equipe } = req.body;

  if (!id_usuario)
    return res.status(400).json({ message: "id_usuario é obrigatório" });

  try {
    const pool = await getPool();

    const exists = await pool.request()
      .input("id_usuario", id_usuario)
      .input("id_equipe", id)
      .query(`SELECT * FROM usuarios_equipes WHERE id_usuario=@id_usuario AND id_equipe=@id_equipe`);

    if (exists.recordset.length > 0)
      return res.status(400).json({ message: "Usuário já está na equipe" });

    await pool.request()
      .input("id_usuario", id_usuario)
      .input("id_equipe", id)
      .input("funcao_na_equipe", funcao_na_equipe || "Membro")
      .query(`INSERT INTO usuarios_equipes (id_usuario, id_equipe, funcao_na_equipe)
              VALUES (@id_usuario, @id_equipe, @funcao_na_equipe)`);

    res.status(201).json({ message: "Usuário adicionado à equipe" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao adicionar membro" });
  }
});

// Remover membro
r.delete("/equipes/:id/membros/:idUsuario", async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request()
      .input("id_usuario", req.params.idUsuario)
      .input("id_equipe", req.params.id)
      .query(`DELETE FROM usuarios_equipes WHERE id_usuario=@id_usuario AND id_equipe=@id_equipe`);
    res.json({ message: "Usuário removido" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao remover membro" });
  }
});

// ==========================================
// EVENTOS
// ==========================================

// Listar eventos
r.get("/eventos", async (_, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT e.id_evento, e.nome_evento, e.descricao, e.data_inicio, e.data_fim, e.local,
             u.nome + ' ' + u.sobrenome AS organizador
      FROM eventos e
      JOIN users u ON u.id = e.id_organizador
      ORDER BY e.data_inicio DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Erro ao listar eventos" });
  }
});

// Criar evento
r.post("/eventos", async (req, res) => {
  const { nome_evento, descricao, data_inicio, data_fim, local, id_organizador } = req.body;
  if (!nome_evento || !data_inicio || !id_organizador)
    return res.status(400).json({ message: "Campos obrigatórios ausentes" });

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("nome_evento", nome_evento)
      .input("descricao", descricao || "")
      .input("data_inicio", data_inicio)
      .input("data_fim", data_fim || null)
      .input("local", local || "")
      .input("id_organizador", id_organizador)
      .query(`
        INSERT INTO eventos (nome_evento, descricao, data_inicio, data_fim, local, id_organizador)
        VALUES (@nome_evento, @descricao, @data_inicio, @data_fim, @local, @id_organizador);
        SELECT * FROM eventos WHERE id_evento = SCOPE_IDENTITY();
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar evento" });
  }
});

// Excluir evento
r.delete("/eventos/:id", async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request().input("id", req.params.id).query("DELETE FROM eventos WHERE id_evento=@id");
    res.json({ message: "Evento excluído" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao excluir evento" });
  }
});

// ==========================================
// DOAÇÕES
// ==========================================

// Listar doações
// Criar doação
r.post("/doacoes", async (req, res) => {
  const { id_usuario, id_evento, id_equipe, tipo_doacao, valor, observacoes, itens } = req.body;
  console.log("Recebendo doação:", req.body);

  if (!id_usuario || !id_evento || !id_equipe || !tipo_doacao)
    return res.status(400).json({ message: "Campos obrigatórios ausentes" });

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("id_usuario", id_usuario)
      .input("id_evento", id_evento)
      .input("id_equipe", id_equipe)
      .input("tipo_doacao", tipo_doacao)
      .input("valor", valor || null)
      .input("observacoes", observacoes || "")
      .query(`
        INSERT INTO doacoes (id_usuario, id_evento, id_equipe, tipo_doacao, valor, observacoes)
        VALUES (@id_usuario, @id_evento, @id_equipe, @tipo_doacao, @valor, @observacoes);
        SELECT id_doacao FROM doacoes WHERE id_doacao = SCOPE_IDENTITY();
      `);

    const id_doacao = result.recordset[0].id_doacao;

    // Se for doação de alimentos, insere os itens
    if (tipo_doacao === "alimento" && Array.isArray(itens)) {
      for (const item of itens) {
        await pool.request()
          .input("id_doacao", id_doacao)
          .input("nome_item", item.nome_item)
          .input("quantidade", item.quantidade)
          .input("unidade", item.unidade || "un")
          .query(`
            INSERT INTO itens_doacao (id_doacao, nome_item, quantidade, unidade)
            VALUES (@id_doacao, @nome_item, @quantidade, @unidade)
          `);
      }
    }

    res.status(201).json({ message: "Doação registrada com sucesso", id_doacao });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao registrar doação" });
  }
});

// Listar doações
r.get("/doacoes", async (_, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT 
        d.id_doacao,
        d.id_usuario,
        d.id_evento,
        d.id_equipe,
        d.tipo_doacao,
        d.valor,
        d.data_doacao,
        d.observacoes,
        u.nome + ' ' + u.sobrenome AS usuario,
        e.nome_evento,
        eq.nome_equipe
      FROM doacoes d
      JOIN users u ON u.id = d.id_usuario
      JOIN eventos e ON e.id_evento = d.id_evento
      LEFT JOIN equipes eq ON eq.id_equipe = d.id_equipe
      ORDER BY d.data_doacao DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao listar doações" });
  }
});


// ==========================================
// EXPORT
// ==========================================
export default r;

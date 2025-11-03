import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "./context/AuthContext";
import "./css/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCadastro, setIsCadastro] = useState(false);

  const { user, login, register } = useAuth();

  useEffect(() => {
    if (user) {
      window.location.href = "/home";
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      await login(email, senha);
    } catch {
      setError("Email ou senha incorretos!");
    }
  };

  const handleCadastro = async () => {
    if (!nome || !sobrenome || !email || !senha) {
      setError("Preencha todos os campos!");
      return;
    }

    try {
      await register({ nome, sobrenome, email, senha, funcao_id: 2 });
      setSuccess("Cadastro realizado! Faça login para continuar.");
      setIsCadastro(false);
      setEmail("");
      setSenha("");
      setNome("");
      setSobrenome("");
    } catch {
      setError("Erro ao cadastrar usuário.");
    }
  };

  return (
    <motion.div
      className="login-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`login-card ${isCadastro ? "cadastro-mode" : ""}`}>
        {/* LOGO / NOME */}
        <h1 className="login-logo">Lideranças Empáticas</h1>

        <h2 className="login-title">
          {isCadastro ? "Crie sua Conta" : "Bem-vindo(a) de volta!"}
        </h2>
        <p className="login-subtitle">
          {isCadastro
            ? "Preencha seus dados para se cadastrar"
            : "Acesse sua conta e continue ajudando quem mais precisa"}
        </p>

        <div className="login-form">
          {isCadastro && (
            <>
              <input
                className="login-input"
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <input
                className="login-input"
                type="text"
                placeholder="Sobrenome"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
              />
            </>
          )}
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {error && <p className="login-error">{error}</p>}
          {success && <p className="login-success">{success}</p>}

          <button
            className="login-button"
            onClick={isCadastro ? handleCadastro : handleLogin}
          >
            {isCadastro ? "Cadastrar" : "Entrar"}
          </button>
        </div>

        <div className="toggle-section">
          {isCadastro ? (
            <p>
              Já tem uma conta?{" "}
              <span onClick={() => setIsCadastro(false)}>Entrar</span>
            </p>
          ) : (
            <p>
              Ainda não tem conta?{" "}
              <span onClick={() => setIsCadastro(true)}>Cadastre-se</span>
            </p>
          )}
        </div>

        {/* RODAPÉ INSTITUCIONAL */}
        <p className="login-footer">
          © {new Date().getFullYear()} Lideranças Empáticas — Unidos por um Brasil mais solidário 💜
        </p>
      </div>
    </motion.div>
  );
}

export default Login;

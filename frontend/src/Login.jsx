// Login.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";

function Login({ user, setUser }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Se já estiver logado, redireciona para o dashboard
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setError("");

    try {
      const res = await axios.post("https://twosemestre.onrender.com/api/login", {
        email,
        senha,
      });

      // salva usuário no state (App.jsx vai persistir no localStorage)
      setUser(res.data);

      // navega para o dashboard
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Email ou senha incorretos!");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">Bem-vindo(a)</h1>
        <p className="login-subtitle">Faça login para continuar</p>

        <div className="login-form">
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
          <button className="login-button" onClick={handleLogin}>
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Carrega o usuário salvo
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 🔹 Salva usuário quando muda
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // 🔹 Funções principais
  const login = async (email, senha) => {
    // Aqui você faria a chamada à API de login
    const fakeUser = { nome: "Usuário", email };
    setUser(fakeUser);
    localStorage.setItem("user", JSON.stringify(fakeUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const register = async (dados) => {
    // chamada da API de cadastro, se houver
    console.log("Registrando:", dados);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

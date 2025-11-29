import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type Role = "alumno" | "docente" | "departamento" | "secretaria" | string;

export interface Persona {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
}

export interface AuthUser {
  token: string | null;
  role: Role | null;
  user_id: number | null;
  persona?: Persona | null;
  alumno_id?: number | null;
  docente_id?: number | null;
  departamento_id?: number | null;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (payload: {
    token: string;
    role: Role;
    user_id: number;
    persona?: Persona;
    alumno_id?: number | null;
    docente_id?: number | null;
    departamento_id?: number | null;
  }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return {
      token,
      role: (localStorage.getItem("role") as Role) || null,
      user_id: localStorage.getItem("user_id") ? Number(localStorage.getItem("user_id")) : null,
      persona: localStorage.getItem("persona")
        ? JSON.parse(localStorage.getItem("persona") as string)
        : null,
      alumno_id: localStorage.getItem("alumno_id") ? Number(localStorage.getItem("alumno_id")) : null,
      docente_id: localStorage.getItem("docente_id") ? Number(localStorage.getItem("docente_id")) : null,
      departamento_id: localStorage.getItem("departamento_id") ? Number(localStorage.getItem("departamento_id")) : null,
    };
  });

  const isAuthenticated = !!user?.token;

  const login = (payload: {
    token: string;
    role: Role;
    user_id: number;
    persona?: Persona;
    alumno_id?: number | null;
    docente_id?: number | null;
    departamento_id?: number | null;
  }) => {
    const { token, role, user_id, persona, alumno_id, docente_id, departamento_id } = payload;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("user_id", String(user_id));
    if (persona) localStorage.setItem("persona", JSON.stringify(persona));
    if (alumno_id) localStorage.setItem("alumno_id", String(alumno_id));
    if (docente_id) localStorage.setItem("docente_id", String(docente_id));
    if (departamento_id) localStorage.setItem("departamento_id", String(departamento_id));

    setUser({
      token,
      role,
      user_id,
      persona: persona || null,
      alumno_id: alumno_id || null,
      docente_id: docente_id || null,
      departamento_id: departamento_id || null,
    });

    // redirigir según rol
    if (role === "alumno") navigate("/alumno/panel");
    else if (role === "docente") navigate("/docente/panel");
    else if (role === "departamento") navigate("/departamento");
    else if (role === "secretaria") navigate("/secretaria");
    else navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("persona");
    localStorage.removeItem("alumno_id");
    localStorage.removeItem("docente_id");
    localStorage.removeItem("departamento_id");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    // aquí podrías validar token con un ping al backend si querés
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};

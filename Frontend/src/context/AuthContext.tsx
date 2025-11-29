import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthUser {
  token: string;
  role: string;
  user_id: number;
  persona: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  };
  alumno_id: number | null;
  docente_id: number | null;
  departamento_id: number | null;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar usuario desde localStorage al montar
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    
    // Redirigir según el rol
    switch (userData.role) {
      case 'alumno':
        navigate('/alumno/panel');
        break;
      case 'docente':
        navigate('/docente/dashboard');
        break;
      case 'departamento':
        navigate('/departamento/panel');
        break;
      case 'secretaria_academica':
        navigate('/secretaria/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
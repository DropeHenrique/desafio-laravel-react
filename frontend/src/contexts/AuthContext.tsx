import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';
import type {
  AuthContextType,
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken: string | null = localStorage.getItem('token');
      const storedUser: string | null = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Verificar se o token ainda é válido
          await authService.me();
        } catch (error) {
          // Token inválido, limpar storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string; data?: AuthResponse }> => {
    try {
      const response = await authService.login(credentials);
      const { user: userData, token: userToken } = response.data;

      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(userToken);
      setUser(userData);

      return { success: true, data: response.data };
    } catch (error: any) {
      // Se for erro de validação (422), relançar a exceção para ser tratada no componente
      if (error.response?.status === 422) {
        throw error;
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao fazer login' 
      };
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string; data?: AuthResponse }> => {
    try {
      const response = await authService.register(userData);
      const { user: newUser, token: userToken } = response.data;

      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setToken(userToken);
      setUser(newUser);

      return { success: true, data: response.data };
    } catch (error: any) {
      // Se for erro de validação (422), relançar a exceção para ser tratada no componente
      if (error.response?.status === 422) {
        throw error;
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao criar conta' 
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

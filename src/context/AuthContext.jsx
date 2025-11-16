// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

function AuthProvider({ children }) {
  
  // O "Lazy Initial State" que lê o localStorage (está correto)
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('@UaiFood:user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('@UaiFood:token');
    
    if (storedToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      return storedToken;
    }
    return null;
  });

  async function login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('@UaiFood:token', token);
      localStorage.setItem('@UaiFood:user', JSON.stringify(user));

      setUser(user);
      setToken(token);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // --- MUDANÇA AQUI ---
      // Retorna o objeto 'user' em vez de 'true'
      return user; 
      // --- FIM DA MUDANÇA ---

    } catch (error) {
      console.error('Erro no login:', error.response?.data?.error); 
      return false; // Retorna 'false' em caso de falha
    }
  }

  function logout() {
    localStorage.removeItem('@UaiFood:token');
    localStorage.removeItem('@UaiFood:user');

    setUser(null);
    setToken(null);

    delete api.defaults.headers.common['Authorization'];
  }
  
  return (
    <AuthContext.Provider value={{ 
        user, 
        token, 
        login, 
        logout,
        isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
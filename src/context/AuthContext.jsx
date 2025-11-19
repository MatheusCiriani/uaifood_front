// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

function AuthProvider({ children }) {
  
  // Lazy Initial State (Lê do localStorage)
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
      
      return user; 

    } catch (error) {
      console.error('Erro no login:', error.response?.data?.error);
      return false;
    }
  }

  function logout() {
    localStorage.removeItem('@UaiFood:token');
    localStorage.removeItem('@UaiFood:user');

    setUser(null);
    setToken(null);

    delete api.defaults.headers.common['Authorization'];
  }

  // --- NOVA FUNÇÃO: Atualiza os dados do usuário localmente ---
  function updateUserLocal(newData) {
    setUser((prevUser) => {
      // Mescla os dados antigos com os novos
      const updatedUser = { ...prevUser, ...newData };
      // Salva no localStorage para persistir no F5
      localStorage.setItem('@UaiFood:user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }

  return (
    <AuthContext.Provider value={{ 
        user, 
        token, 
        login, 
        logout,
        updateUserLocal, // <--- Exportando a nova função
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
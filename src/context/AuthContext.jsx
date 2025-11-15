// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import api from '../services/api'; // Nosso 'axios' configurado

// 1. Cria o Context
const AuthContext = createContext();

// 2. Cria o Provedor (o "Componente Global")
function AuthProvider({ children }) {
  // 3. Estados que vamos armazenar
  // O 'user' e o 'token' começam nulos (usuário não logado)
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // 4. A função de Login
  // Ela será chamada pela nossa página de Login
  async function login(email, password) {
    try {
      // Chama o backend
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // Pega o token e o user da resposta do backend
      const { token, user } = response.data;

      // Armazena no estado
      setUser(user);
      setToken(token);

      // Salva o token no 'localStorage' do navegador
      // Isso faz com que o usuário continue logado se fechar a aba
      localStorage.setItem('@UaiFood:token', token);
      localStorage.setItem('@UaiFood:user', JSON.stringify(user));

      // Configura o 'axios' para enviar o token em TODAS
      // as requisições futuras
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return true; // Indica que o login deu certo
    } catch (error) {
      console.error('Erro no login:', error.response.data.error);
      return false; // Indica que o login falhou
    }
  }

  // 5. A função de Logout
  function logout() {
    // Limpa o 'localStorage'
    localStorage.removeItem('@UaiFood:token');
    localStorage.removeItem('@UaiFood:user');

    // Limpa os estados
    setUser(null);
    setToken(null);

    // Remove o token do cabeçalho do 'axios'
    delete api.defaults.headers.common['Authorization'];
  }
  
  // 6. O 'value' é o que disponibilizamos para o resto do app
  return (
    <AuthContext.Provider value={{ 
        user, 
        token, 
        login, 
        logout,
        isAuthenticated: !!user // Uma forma fácil de checar se está logado
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// 7. Cria um "Hook" customizado para facilitar o uso
// Em vez de importar o 'useContext' e o 'AuthContext' em todo lugar,
// vamos importar só o 'useAuth'
function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
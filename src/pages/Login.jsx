// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Form.css'; 
import logoUrl from '../assets/uaifood_lg.svg'; 
import { toast } from 'react-toastify'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Removemos o estado 'error' visual
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warn('Preencha email e senha.');
      return;
    }

    try {
      const user = await login(email, password);
      
      if (user) {
        toast.success(`Bem-vindo, ${user.name}!`); // <-- Feedback positivo
        if (from) {
          navigate(from, { replace: true });
        } else {
          const defaultPath = user.type === 'ADMIN' ? '/admin/dashboard' : '/cardapio';
          navigate(defaultPath, { replace: true });
        }
      } else {
        // A mensagem específica virá do backend (Zod) ou AuthController
        toast.error('Email ou senha incorretos.');
      }
    } catch (err) {
      toast.error('Erro de conexão. Tente novamente.');
    }
  };

  return (
    <div className="form-container">
      <img src={logoUrl} className="form-logo" alt="UaiFood Logo" />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        {/* Removemos o <p className="form-error"> pois o Toast vai exibir o erro */}
        
        <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
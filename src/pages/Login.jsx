// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verifica de onde o usuário veio (ex: '/carrinho')
  // Se ele não veio de lugar nenhum (foi direto pro login), o padrão é '/home'
  const from = location.state?.from || '/home';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha email e senha.');
      return;
    }

    try {
      const success = await login(email, password);
      
      if (success) {
        // Sucesso! Redireciona para 'from' (ex: '/carrinho' ou '/home')
        navigate(from, { replace: true });
      } else {
        setError('Falha no login. Verifique suas credenciais.');
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <div>
      <h2>Login - UaiFood</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Form.css'; // Importa o CSS
import logoUrl from '../assets/uaifood_lg.svg'; // Importa o Logo

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // --- MUDANÇA AQUI ---
  // Não definimos mais um 'default' aqui (como '/home')
  const from = location.state?.from;
  // --- FIM DA MUDANÇA ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha email e senha.');
      return;
    }

    try {
      // --- MUDANÇA AQUI ---
      // 1. 'login()' agora retorna o objeto 'user' ou 'false'
      const user = await login(email, password);
      
      if (user) {
        // 2. Login com sucesso! Agora decidimos para onde ir.

        // Se o usuário veio de uma página específica (ex: carrinho)
        if (from) {
          navigate(from, { replace: true });
        } else {
          // Se ele logou direto, verificamos o tipo
          // Isso corrige o bug do 404, pois '/home' não existe mais
          const defaultPath = user.type === 'ADMIN' 
            ? '/admin/dashboard' 
            : '/cardapio'; // Clientes vão para o cardápio
          navigate(defaultPath, { replace: true });
        }
        
      } else {
        // 3. 'login()' retornou 'false'
        setError('Falha no login. Verifique suas credenciais.');
      }
      // --- FIM DA MUDANÇA ---
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <div className="form-container">
      
      {/* O JSX (HTML) não muda. O logo já está correto. */}
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
        
        {error && <p className="form-error">{error}</p>}
        
        <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
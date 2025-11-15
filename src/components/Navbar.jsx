// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItemsInCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      
      {/* Links da Esquerda */}
      <div className="navbar-links-left">
        <Link to="/" className="navbar-brand">
          UaiFood
        </Link>
        
        {/* MUDANÇA AQUI (para /cardapio) */}
        <Link to="/cardapio">Cardápio</Link> 
        
        {isAuthenticated && (
          <Link to="/meus-pedidos">Meus Pedidos</Link>
        )}
        
        <Link to="/carrinho">
          Carrinho ({totalItemsInCart})
        </Link>

        {user?.type === 'ADMIN' && (
          <Link to="/admin/dashboard" style={{ color: 'red', fontWeight: 'bold' }}>
            PAINEL ADMIN
          </Link>
        )}
      </div>

      {/* Links da Direita */}
      <div className="navbar-links-right">
        {isAuthenticated ? (
          <>
            <span>Olá, {user?.name}</span>
            <button onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registrar</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
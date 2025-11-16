// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';
// 1. IMPORTA APENAS O ÍCONE
import logoIconUrl from '../assets/uaifood_icon.svg'; 

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItemsInCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    // 2. O NAVBAR VOLTA A TER APENAS 2 SEÇÕES FILHAS
    <nav className="navbar">
      
      {/* --- SEÇÃO 1: LINKS DA ESQUERDA --- */}
      <div className="navbar-links-left">
        {/* O Ícone é o primeiro link */}
        <Link to="/" className="navbar-icon-link">
          <img src={logoIconUrl} alt="UaiFood Icon" className="navbar-icon-brand" />
        </Link>
        
        <Link to="/cardapio">Cardápio</Link> 
        
        {isAuthenticated && user.type === 'CLIENT' && (
          <Link to="/meus-pedidos">Meus Pedidos</Link>
        )}
        
        {user?.type === 'ADMIN' && (
          <Link to="/admin/dashboard" className="navbar-admin-link">
            Painel Admin
          </Link>
        )}
      </div>

      {/* --- SEÇÃO 2: LINKS DA DIREITA --- */}
      <div className="navbar-links-right">
        {user?.type !== 'ADMIN' && (
          <Link to="/carrinho">
            Carrinho ({totalItemsInCart})
          </Link>
        )}
        
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
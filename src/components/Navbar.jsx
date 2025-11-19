// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';
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
    <nav className="navbar">
      
      {/* --- ESQUERDA --- */}
      <div className="navbar-links-left">
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

      {/* --- DIREITA --- */}
      <div className="navbar-links-right">
        {user?.type !== 'ADMIN' && (
          <Link to="/carrinho">
            Carrinho ({totalItemsInCart})
          </Link>
        )}
        
        {isAuthenticated ? (
          <>
            <span className="notranslate">Olá, {user?.name}</span>
            
            {/* NOVO BOTÃO MEU PERFIL */}
            <Link to="/perfil" style={{ fontWeight: 'bold' }}>
              Meu Perfil
            </Link>

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
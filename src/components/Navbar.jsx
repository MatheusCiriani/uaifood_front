// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItemsInCart } = useCart();
  const navigate = useNavigate();
 
  console.log('NAVBAR ATUALIZOU. Total de itens:', totalItemsInCart);

  const handleLogout = () => {
    logout();
    navigate('/'); // Após o logout, volta para a home pública
  };

  return (
    <nav style={{ background: '#f0f0f0', padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
      
      {/* Links da Esquerda (Públicos ou Protegidos) */}
      <div>
        <Link to="/" style={{ marginRight: '1rem' }}>
            Cardápio (Home)
        </Link>
        
        {/* Este link só aparece se o usuário estiver logado */}
        {isAuthenticated && (
          <Link to="/meus-pedidos">
            Meus Pedidos
          </Link>
        )}
        <Link to="/carrinho">
          Carrinho ({totalItemsInCart})
        </Link>
      </div>

      {/* Links da Direita (Login/Logout) */}
      <div>
        {isAuthenticated ? (
          <>
            <span style={{ marginRight: '1rem' }}>Olá, {user?.name}</span>
            <button onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '1rem' }}>
              Login
            </Link>
            <Link to="/register">
              Registrar
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
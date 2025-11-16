// src/pages/Carrinho.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; 
import { useState } from 'react'; 
import './Carrinho.css'; // <-- 1. IMPORTE O NOVO CSS

function Carrinho() {
  const { cartItems, addToCart, removeFromCart, totalItemsInCart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // (totalPrice - sem mudança)
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.unitPrice * item.quantity);
  }, 0);

  // (handleCheckout - sem mudança)
  const handleCheckout = async () => {
    setError(''); 
    if (!isAuthenticated) {
      navigate('/login', { replace: true, state: { from: '/carrinho' } });
      return; 
    }
    const itemsForBackend = cartItems.map(item => ({
      itemId: item.id,
      quantity: item.quantity
    }));
    const orderData = {
      paymentMethod: 'PIX',
      status: 'PENDING',
      clientId: user.id,
      createdById: user.id,
      items: itemsForBackend,
    };
    try {
      setLoading(true);
      await api.post('/orders', orderData);
      setLoading(false);
      alert('Pedido realizado com sucesso!');
      clearCart(); 
      navigate('/meus-pedidos'); 
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Erro ao finalizar o pedido. Tente novamente.');
      }
      console.error(err);
    }
  };

  // --- 2. APLIQUE AS CLASSES CSS ---
  return (
    <div className="cart-container">
      
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Seu carrinho está vazio.</p>
          <Link to="/cardapio">Voltar ao Cardápio</Link>
        </div>
      ) : (
        <div>
          {/* Lista de Itens */}
          {cartItems.map(item => (
            <div key={item.id} className="cart-item-card">
              <div className="cart-item-info">
                <h4>{item.description}</h4>
                <p>Preço Un.: R$ {item.unitPrice.toFixed(2)}</p>
                <p><strong>Total: R$ {(item.unitPrice * item.quantity).toFixed(2)}</strong></p>
              </div>
              
              {/* Controles de Quantidade */}
              <div className="cart-item-quantity">
                <button onClick={() => removeFromCart(item.id)} disabled={loading}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => addToCart(item)} disabled={loading}>+</button>
              </div>
            </div>
          ))}

          {/* Resumo e Total */}
          <div className="cart-summary">
            <h3>Resumo do Pedido</h3>
            <p>Total de Itens: {totalItemsInCart}</p>
            <h4>Preço Total: R$ {totalPrice.toFixed(2)}</h4>
            
            <button 
              onClick={handleCheckout} 
              className="checkout-button"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Finalizar Pedido'}
            </button>
          </div>

          {/* Mostra erros da API */}
          {error && <p className="cart-error">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default Carrinho;
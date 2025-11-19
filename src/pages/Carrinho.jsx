// src/pages/Carrinho.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; 
import { useState } from 'react'; 
import './Carrinho.css'; 

// 1. IMPORTE O TOAST
import { toast } from 'react-toastify';

function Carrinho() {
  const { cartItems, addToCart, removeFromCart, totalItemsInCart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  // Não precisamos mais do estado 'error' visual, o toast resolve
  const [paymentMethod, setPaymentMethod] = useState(''); 

  const paymentOptions = [
    { id: 'PIX', label: 'Pix' },
    { id: 'CREDIT', label: 'Crédito' },
    { id: 'DEBIT', label: 'Débito' },
    { id: 'CASH', label: 'Dinheiro' },
  ];

  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.unitPrice * item.quantity);
  }, 0);

  const handleCheckout = async () => {
    
    if (!isAuthenticated) {
      // 2. MENSAGEM INFORMATIVA
      toast.info("Faça login para finalizar seu pedido.");
      navigate('/login', { replace: true, state: { from: '/carrinho' } });
      return; 
    }

    if (!paymentMethod) {
      // 3. AVISO (Warning)
      toast.warn("Por favor, selecione uma forma de pagamento.");
      return;
    }

    const itemsForBackend = cartItems.map(item => ({
      itemId: item.id,
      quantity: item.quantity
    }));

    const orderData = {
      paymentMethod: paymentMethod,
      status: 'PENDING',
      clientId: user.id,
      createdById: user.id,
      items: itemsForBackend,
    };

    try {
      setLoading(true);
      await api.post('/orders', orderData);
      setLoading(false);
      
      // 4. SUCESSO
      toast.success("Pedido realizado com sucesso! 🚀");
      
      clearCart(); 
      navigate('/meus-pedidos'); 
    } catch (err) {
      setLoading(false);
      // 5. ERRO (Pega a mensagem do Zod/Backend se existir)
      const errorMsg = err.response?.data?.error || "Erro ao finalizar pedido.";
      toast.error(errorMsg);
      console.error(err);
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Seu Carrinho de Compras</h2>
      
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Seu carrinho está vazio.</p>
          <Link to="/cardapio">Voltar ao Cardápio</Link>
        </div>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item-card">
              <div className="cart-item-info">
                <h4>{item.description}</h4>
                <p>Preço Un.: R$ {item.unitPrice.toFixed(2)}</p>
                <p><strong>Total: R$ {(item.unitPrice * item.quantity).toFixed(2)}</strong></p>
              </div>
              <div className="cart-item-quantity">
                <button onClick={() => removeFromCart(item.id)} disabled={loading}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => addToCart(item)} disabled={loading}>+</button>
              </div>
            </div>
          ))}

          <div className="payment-section">
            <h3>Forma de Pagamento</h3>
            <div className="payment-options">
              {paymentOptions.map(option => (
                <div
                  key={option.id}
                  className={`payment-card ${paymentMethod === option.id ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod(option.id)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>

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
        </div>
      )}
    </div>
  );
}

export default Carrinho;
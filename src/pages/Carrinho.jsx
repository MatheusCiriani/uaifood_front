// src/pages/Carrinho.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; // Importa o Axios
import { useState } from 'react'; // Importa o useState

function Carrinho() {
  const { cartItems, addToCart, removeFromCart, totalItemsInCart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth(); // Pega o 'user' logado
  const navigate = useNavigate();

  // Estados para feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calcula o preço total
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.unitPrice * item.quantity);
  }, 0);

  // Ação para o botão "Finalizar Pedido"
  const handleCheckout = async () => {
    setError(''); // Limpa erros antigos

    // 1. Checa se está logado
    if (!isAuthenticated) {
      navigate('/login', { replace: true, state: { from: '/carrinho' } });
      return; // Para a execução
    }

    // 2. Formata os itens do carrinho para o formato que o backend espera
    const itemsForBackend = cartItems.map(item => ({
      itemId: item.id,
      quantity: item.quantity
    }));

    // 3. Monta o payload final do pedido
    const orderData = {
      paymentMethod: 'PIX', // Você pode mudar isso depois
      status: 'PENDING',
      clientId: user.id,      // ID do usuário logado
      createdById: user.id,   // ID de quem criou (o próprio usuário)
      items: itemsForBackend,
    };

    try {
      setLoading(true);
      
      // 4. Envia o pedido para a API
      await api.post('/orders', orderData);

      // 5. Sucesso!
      setLoading(false);
      alert('Pedido realizado com sucesso!');
      
      clearCart(); // Limpa o carrinho
      navigate('/meus-pedidos'); // Envia o usuário para a página de pedidos

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

  return (
    <div>
      <h2>Seu Carrinho de Compras</h2>
      
      {cartItems.length === 0 ? (
        // Se o carrinho está vazio
        <div>
          <p>Seu carrinho está vazio.</p>
          <Link to="/">Voltar ao Cardápio</Link>
        </div>
      ) : (
        // Se tiver itens
        <div>
          {/* Lista de Itens */}
          {cartItems.map(item => (
            <div key={item.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
              <h4>{item.description}</h4>
              <p>Preço Un.: R$ {item.unitPrice.toFixed(2)}</p>
              <p>Total do Item: R$ {(item.unitPrice * item.quantity).toFixed(2)}</p>
              
              {/* Controles de Quantidade */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button onClick={() => removeFromCart(item.id)} disabled={loading}>-</button>
                <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                <button onClick={() => addToCart(item)} disabled={loading}>+</button>
              </div>
            </div>
          ))}

          {/* Resumo e Total */}
          <hr />
          <h3>Resumo do Pedido</h3>
          <p>Total de Itens: {totalItemsInCart}</p>
          <h4>Preço Total: R$ {totalPrice.toFixed(2)}</h4>
          
          <button 
            onClick={handleCheckout} 
            style={{ padding: '10px 20px', fontSize: '1.2rem' }}
            disabled={loading} // Desabilita o botão enquanto carrega
          >
            {loading ? 'Enviando...' : 'Finalizar Pedido'}
          </button>

          {/* Mostra erros da API */}
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
      )}
    </div>
  );
}

export default Carrinho;
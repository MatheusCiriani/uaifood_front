// src/pages/MeusPedidos.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Precisamos do Auth
import api from '../services/api'; // Precisamos da API

function MeusPedidos() {
  const { user } = useAuth(); // <-- ERRO CORRIGIDO AQUI
  const [orders, setOrders] = useState([]); // Array para guardar os pedidos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Busca os pedidos quando a página carrega
  useEffect(() => {
    async function fetchOrders() {
      // Otimização: Se você atualizou o backend (orderController.js)
      // para filtrar os pedidos por usuário, ele já virá filtrado.
      try {
        setLoading(true);
        const response = await api.get('/orders');
        
        // Se você NÃO atualizou o backend, descomente a linha abaixo
        // const userOrders = response.data.filter(order => order.clientId === user.id);
        
        // Se você ATUALIZOU o backend, use a linha abaixo:
        setOrders(response.data);
        
      } catch (err) {
        setError('Erro ao buscar seus pedidos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    // Só busca os pedidos se o usuário estiver definido
    if (user?.id) {
      fetchOrders();
    }
  }, [user]); // 'user' na dependência: Roda de novo se o usuário mudar

  // --- Renderização ---

  if (loading) {
    return <h2>Carregando seus pedidos...</h2>;
  }

  if (error) {
    return <h2 style={{ color: 'red' }}>{error}</h2>;
  }

  return (
    <div>
      <h2>Histórico de Pedidos de {user?.name}</h2>
      
      {orders.length === 0 ? (
        <p>Você ainda não fez nenhum pedido.</p>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid #ddd', padding: '15px', margin: '15px' }}>
              <h4>Pedido #{order.id} - Status: {order.status}</h4>
              <p>Feito em: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Pagamento: {order.paymentMethod}</p>
              
              <h5>Itens:</h5>
              <ul>
                {order.orderItems.map(item => (
                  <li key={item.id}>
                    {item.quantity}x {item.item.description} (R$ {item.item.unitPrice.toFixed(2)} cada)
                  </li>
                ))}
              </ul>
              
              {/* Calcula o total do pedido específico */}
              <strong>Total do Pedido: R$ 
                {order.orderItems.reduce((total, item) => total + (item.item.unitPrice * item.quantity), 0).toFixed(2)}
              </strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MeusPedidos;
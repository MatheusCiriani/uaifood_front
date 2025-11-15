// src/pages/AdminManageOrders.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

function AdminManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Função para carregar todos os pedidos
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      // O backend já sabe que somos ADMIN (graças ao token)
      // e vai nos enviar TODOS os pedidos.
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      setError('Erro ao carregar os pedidos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Carrega os pedidos quando a página abre
  useEffect(() => {
    fetchAllOrders();
  }, []); // O '[]' vazio garante que rode só uma vez

  // 3. Função para ATUALIZAR o status de um pedido
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // Chama a rota protegida de admin
      await api.put(`/orders/${orderId}`, {
        status: newStatus,
      });
      
      // Atualiza a lista de pedidos na tela sem recarregar
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert('Erro ao atualizar o status do pedido.');
      console.error(err);
    }
  };

  // --- Renderização ---
  if (loading) return <h2>Carregando todos os pedidos...</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;

  return (
    <div>
      <h2>Gerenciamento de Pedidos</h2>
      {orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid #000', padding: '15px', margin: '15px' }}>
              <h4>Pedido #{order.id} - Cliente: {order.client.name}</h4>
              <p>Feito em: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Pagamento: {order.paymentMethod}</p>
              
              <h5>Itens:</h5>
              <ul>
                {order.orderItems.map(item => (
                  <li key={item.id}>
                    {item.quantity}x {item.item.description}
                  </li>
                ))}
              </ul>
              
              <hr />
              <div>
                <strong>Status Atual: {order.status}</strong>
                {/* Aqui criamos botões para mudar o status.
                  Desabilitamos o botão do status atual.
                */}
                <div style={{ marginTop: '10px' }}>
                  <button 
                    onClick={() => handleUpdateStatus(order.id, 'PENDING')}
                    disabled={order.status === 'PENDING'}
                  >
                    Marcar Pendente
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                    disabled={order.status === 'COMPLETED'}
                    style={{ margin: '0 10px' }}
                  >
                    Marcar Concluído
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                    disabled={order.status === 'CANCELLED'}
                  >
                    Marcar Cancelado
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminManageOrders;
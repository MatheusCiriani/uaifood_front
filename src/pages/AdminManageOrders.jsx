// src/pages/AdminManageOrders.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminManageOrders.css'; // Importa o CSS da mesma pasta

function AdminManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // (fetchAAllOrders - sem mudança)
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      setError('Erro ao carregar os pedidos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // (handleUpdateStatus - sem mudança)
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, {
        status: newStatus,
      });
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

  if (loading) return <h2>Carregando todos os pedidos...</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;

  return (
    <div className="order-list-container">
      <h2 className="order-list-title">Gerenciamento de Pedidos</h2>
      
      {orders.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Nenhum pedido encontrado.</p>
      ) : (
        <div className="order-list">
          {orders.map(order => (
            // --- 1. MUDANÇA AQUI ---
            // Adiciona a classe de status dinâmica ao card
            <div 
              key={order.id} 
              className={`admin-order-card status-${order.status}`}
            >
              
              {/* Cabeçalho do Card (com a tag de status) */}
              <div className="order-card-header">
                <h4>Pedido #{order.id}</h4>
                <span className={`order-status ${order.status}`}>
                  {order.status}
                </span>
              </div>
              
              {/* Corpo do Card (infos do cliente e itens) */}
              <div className="order-card-body">
                <p><strong>Cliente:</strong> {order.client.name}</p>
                <p><strong>Feito em:</strong> {new Date(order.createdAt).toLocaleString('pt-BR')}</p>
                <p><strong>Pagamento:</strong> {order.paymentMethod}</p>
                
                <h5>Itens:</h5>
                <ul>
                  {order.orderItems.map(item => (
                    <li key={item.id}>
                      {item.quantity}x {item.item.description}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* --- 2. MUDANÇA AQUI --- */}
              {/* Remove as classes 'btn-*' dos botões */}
              <div className="order-card-actions">
                <button 
                  onClick={() => handleUpdateStatus(order.id, 'PENDING')}
                  disabled={order.status === 'PENDING'}
                  // className="btn-pending" (REMOVIDO)
                >
                  Marcar Pendente
                </button>
                <button 
                  onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                  disabled={order.status === 'COMPLETED'}
                  // className="btn-complete" (REMOVIDO)
                >
                  Marcar Concluído
                </button>
                <button 
                  onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                  disabled={order.status === 'CANCELLED'}
                  // className="btn-cancel" (REMOVIDO)
                >
                  Marcar Cancelado
                </button>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminManageOrders;
// src/pages/AdminManageOrders.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminManageOrders.css';
import { toast } from 'react-toastify'; // <-- 1. IMPORTE

function AdminManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Erro de carregamento inicial

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      // Toast para erro de carregamento
      toast.error('Erro ao carregar a lista de pedidos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

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
      
      // 2. FEEDBACK DE SUCESSO
      toast.success(`Pedido #${orderId} atualizado para ${newStatus}!`);

    } catch (err) {
      // 3. FEEDBACK DE ERRO
      toast.error('Erro ao atualizar o status do pedido.');
      console.error(err);
    }
  };

  if (loading) return <h2>Carregando todos os pedidos...</h2>;
  // Se der erro crítico no load, mostra na tela, mas o toast já avisou também
  if (error) return <h2 style={{ color: 'red' }}>Erro ao carregar pedidos.</h2>;

  return (
    <div className="order-list-container">
      <h2 className="order-list-title">Gerenciamento de Pedidos</h2>
      
      {orders.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Nenhum pedido encontrado.</p>
      ) : (
        <div className="order-list">
          {orders.map(order => (
            <div key={order.id} className={`admin-order-card status-${order.status}`}>
              
              <div className="order-card-header">
                <h4>Pedido #{order.id}</h4>
                <span className={`order-status ${order.status}`}>
                  {order.status}
                </span>
              </div>
              
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
              
              <div className="order-card-actions">
                <button 
                  onClick={() => handleUpdateStatus(order.id, 'PENDING')}
                  disabled={order.status === 'PENDING'}
                >
                  Marcar Pendente
                </button>
                <button 
                  onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                  disabled={order.status === 'COMPLETED'}
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
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminManageOrders;
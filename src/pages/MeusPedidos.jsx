// src/pages/MeusPedidos.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './MeusPedidos.css'; // <-- 1. IMPORTE O NOVO CSS

function MeusPedidos() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // (useEffect e fetchOrders - sem mudança)
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (err) {
        setError('Erro ao buscar seus pedidos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  if (loading) return <h2>Carregando seus pedidos...</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;

  // --- 2. APLIQUE AS CLASSES CSS ---
  return (
    <div className="pedidos-container">
      
      {orders.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Você ainda não fez nenhum pedido.</p>
      ) : (
        <div>
          {orders.map(order => (
            // Card principal com classe de status
            <div 
              key={order.id} 
              className={`pedido-card status-${order.status}`}
            >
              {/* Cabeçalho do Card */}
              <div className="pedido-card-header">
                <h4>Pedido #{order.id}</h4>
                <span className={`pedido-status ${order.status}`}>
                  {order.status}
                </span>
              </div>
              
              {/* Corpo do Card */}
              <div className="pedido-card-body">
                <p><strong>Feito em:</strong> {new Date(order.createdAt).toLocaleString('pt-BR')}</p>
                <p><strong>Pagamento:</strong> {order.paymentMethod}</p>
                
                <h5>Itens:</h5>
                <ul>
                  {order.orderItems.map(item => (
                    <li key={item.id}>
                      {item.quantity}x {item.item.description} (R$ {item.item.unitPrice.toFixed(2)} cada)
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total do Pedido */}
              <div className="pedido-card-total">
                Total: R$ 
                {order.orderItems.reduce((total, item) => total + (item.item.unitPrice * item.quantity), 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MeusPedidos;
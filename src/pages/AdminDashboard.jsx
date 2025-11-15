// src/pages/AdminDashboard.jsx
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div>
      <h2>Painel do Administrador</h2>
      <p>Bem-vindo, Admin!</p>
      
      <nav>
        <ul>
          <li>
            <Link to="/admin/pedidos">Gerenciar Pedidos</Link>
          </li>
          {/* 1. ADICIONE ESTE LINK */}
          <li>
            <Link to="/admin/itens">Gerenciar Itens do Cardápio</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminDashboard;
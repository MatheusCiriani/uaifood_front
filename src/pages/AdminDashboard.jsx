// src/pages/AdminDashboard.jsx
import { Link } from 'react-router-dom';
import './AdminDashboard.css'; // <-- 1. IMPORTE O NOVO CSS

function AdminDashboard() {
  return (
    // 2. USE O CONTAINER PRINCIPAL
    <div className="dashboard-container">
      
      {/* 3. SUBSTITUA A NAV/UL PELA NOVA GRADE */}
      <div className="dashboard-grid">
        
        {/* Cada link agora é um "Cartão" */}
        <Link to="/admin/pedidos" className="dashboard-card">
          Gerenciar Pedidos
        </Link>
        
        <Link to="/admin/itens" className="dashboard-card">
          Gerenciar Itens
        </Link>

        <Link to="/admin/categorias" className="dashboard-card">
          Gerenciar Categorias
        </Link>
        
        {/* Você pode adicionar mais "ferramentas" aqui facilmente */}
        {/* <Link to="/admin/categorias" className="dashboard-card">
          Gerenciar Categorias
        </Link>
        <Link to="/admin/usuarios" className="dashboard-card">
          Gerenciar Usuários
        </Link>
        */}

      </div>
    </div>
  );
}

export default AdminDashboard;
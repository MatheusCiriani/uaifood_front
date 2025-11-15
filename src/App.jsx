// src/App.jsx
import { Routes, Route } from 'react-router-dom';

// Importe os "Blocos"
import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Importe as "Páginas"
import LandingPage from './pages/LandingPage'; // <-- (Nova Home)
import Cardapio from './pages/Cardapio';     // <-- (Antiga Home)
import Login from './pages/Login';
import Register from './pages/Register';
import MeusPedidos from './pages/MeusPedidos';
import Carrinho from './pages/Carrinho';
import AdminDashboard from './pages/AdminDashboard';
import AdminManageOrders from './pages/AdminManageOrders';
import AdminManageItems from './pages/AdminManageItems';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* --- Rotas Públicas --- */}
        <Route index element={<LandingPage />} /> {/* Rota "/" agora é a LandingPage */}
        <Route path="/cardapio" element={<Cardapio />} /> {/* Nova rota do cardápio */}
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/carrinho" element={<Carrinho />} />
        
        {/* --- Rotas Protegidas --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/meus-pedidos" element={<MeusPedidos />} />
          
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/pedidos" element={<AdminManageOrders />} />
            <Route path="/admin/itens" element={<AdminManageItems />} />
          </Route>
        </Route>

        {/* Rota 404 */}
        <Route path="*" element={<h2>Página não encontrada (404)</h2>} />
      </Route>
    </Routes>
  );
}

export default App;
// src/App.jsx
import { Routes, Route } from 'react-router-dom';

// Importe os "Blocos"
import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';

// Importe as "Páginas"
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MeusPedidos from './pages/MeusPedidos';
import Carrinho from './pages/Carrinho';
import AdminRoute from './routes/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminManageOrders from './pages/AdminManageOrders';
import AdminManageItems from './pages/AdminManageItems';



function App() {
  return (
    <Routes>
      {/* Agora, todas as nossas rotas estão "filhas" do Layout.
        Isso significa que todas elas terão o Navbar e o <main>.
      */}
      <Route path="/" element={<Layout />}>

        {/* --- Rotas Públicas --- */}
        <Route index element={<Home />} /> {/* 'index' significa a rota "/" */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/carrinho" element={<Carrinho />} />
        
        {/* --- Rotas Protegidas --- */}
        {/* O "Porteiro" fica aqui, protegendo só o que está dentro dele */}
        <Route element={<ProtectedRoute />}>
          <Route path="/meus-pedidos" element={<MeusPedidos />} />
          {/* Futuramente: <Route path="/checkout" element={<Checkout />} /> */}
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
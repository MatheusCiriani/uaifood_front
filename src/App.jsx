// src/App.jsx
import { Routes, Route } from 'react-router-dom';

// 1. IMPORTES DO TOASTIFY
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

import LandingPage from './pages/LandingPage'; 
import Cardapio from './pages/Cardapio';     
import Login from './pages/Login';
import Register from './pages/Register';
import MeusPedidos from './pages/MeusPedidos';
import Carrinho from './pages/Carrinho';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminManageOrders from './pages/AdminManageOrders';
import AdminManageItems from './pages/AdminManageItems';
import AdminManageCategories from './pages/AdminManageCategories';

function App() {
  return (
    <>
      {/* 2. COMPONENTE QUE EXIBE AS NOTIFICAÇÕES (Global) */}
      <ToastContainer 
        autoClose={3000}    /* Fecha em 3 segundos */
        position="top-right" /* Posição na tela */
        theme="colored"     /* Tema colorido (verde sucesso, vermelho erro) */
      />
      
      <Routes>
        <Route path="/" element={<Layout />}>

          {/* Rotas Públicas */}
          <Route index element={<LandingPage />} />
          <Route path="/cardapio" element={<Cardapio />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/carrinho" element={<Carrinho />} />
          
          {/* Rotas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/meus-pedidos" element={<MeusPedidos />} />
            <Route path="/perfil" element={<Profile />} />
            
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/pedidos" element={<AdminManageOrders />} />
              <Route path="/admin/itens" element={<AdminManageItems />} />
              <Route path="/admin/categorias" element={<AdminManageCategories />} />
            </Route>
          </Route>

          {/* Rota 404 */}
          <Route path="*" element={<h2>Página não encontrada (404)</h2>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
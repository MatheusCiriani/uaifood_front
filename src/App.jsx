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
        </Route>

        {/* Rota 404 */}
        <Route path="*" element={<h2>Página não encontrada (404)</h2>} />
      </Route>
    </Routes>
  );
}

export default App;
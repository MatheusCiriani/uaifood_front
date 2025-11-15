// src/routes/ProtectedRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const { isAuthenticated } = useAuth(); // Pega o 'true' ou 'false' do context

  if (!isAuthenticated) {
    // Se não está logado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  // Se está logado, renderiza o componente da rota (ex: <Home />)
  // O <Outlet /> é o "espaço reservado" para a página de destino.
  return <Outlet />;
}

export default ProtectedRoute;
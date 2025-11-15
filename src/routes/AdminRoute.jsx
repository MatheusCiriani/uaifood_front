// src/routes/AdminRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function AdminRoute() {
  const { user } = useAuth(); // Só precisamos do 'user'

  // O <ProtectedRoute> (componente pai, que vamos configurar no App.jsx)
  // já vai ter verificado se o usuário está logado.
  // Este componente só precisa verificar SE o usuário logado é ADMIN.

  if (user.type !== 'ADMIN') {
    // Se não for admin, redireciona o usuário para a Home (página principal)
    return <Navigate to="/" replace />;
  }

  // Se o usuário é logado E é admin, renderiza a página de admin (o <Outlet />)
  return <Outlet />;
}

export default AdminRoute;
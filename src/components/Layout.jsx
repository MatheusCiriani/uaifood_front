// src/components/Layout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '1rem' }}>
        {/* O <Outlet /> é o placeholder onde o React Router
            vai renderizar a página da rota atual (ex: Home, Login, etc.) */}
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
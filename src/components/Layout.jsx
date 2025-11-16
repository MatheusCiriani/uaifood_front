// src/components/Layout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div>
      <Navbar />
      {/* MUDANÇA AQUI: Removemos o padding da tag <main>.
        Isso fará o conteúdo da página "colar" no Navbar, 
        removendo a faixa branca.
      */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
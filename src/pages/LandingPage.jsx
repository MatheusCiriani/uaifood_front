// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import './LandingPage.css';

// 1. IMPORTE O SVG como um caminho (URL)
// Remova o '?react' do final
import logoUrl from '../assets/uaifood_lg.svg';

function LandingPage() {
  return (
    <div className="landing-container">
      
      {/* 2. USE uma tag <img> normal e passe a URL para o 'src' */}
      <img 
        src={logoUrl} 
        className="landing-brand-logo" 
        alt="UaiFood Logo" 
      />
      
      <Link to="/cardapio" className="landing-button">
        Ver Cardápio
      </Link>
    </div>
  );
}

export default LandingPage;
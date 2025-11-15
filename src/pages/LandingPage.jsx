// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-container">
      {/* O "garfo" (podemos trocar por um ícone real depois) */}
      <div className="landing-logo">♆</div> 
      
      <h1 className="landing-title">UaiFood</h1>
      
      <Link to="/cardapio" className="landing-button">
        Ver Cardápio
      </Link>
    </div>
  );
}

export default LandingPage;
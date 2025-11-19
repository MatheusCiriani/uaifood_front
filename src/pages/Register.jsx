// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Form.css';
import logoUrl from '../assets/uaifood_lg.svg';
import { toast } from 'react-toastify'; // <-- 1. IMPORTE

function Register() {
  const navigate = useNavigate();
  // Removemos os estados visuais 'error' e 'success' pois o toast cuida disso
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !street || !number || !city) {
      // 2. AVISO
      toast.warn('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const dataToSend = {
      name, email, phone, password, type: 'CLIENT',
      address: { street, number, district, city, state, zipCode },
    };

    try {
      await api.post('/users', dataToSend);
      
      // 3. SUCESSO
      toast.success('Cadastro realizado! Faça login para continuar.');
      
      // Redireciona um pouco mais rápido agora
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      // 4. ERRO
      const errorMsg = err.response?.data?.error || 'Erro ao realizar cadastro.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="form-container">
      <img src={logoUrl} className="form-logo" alt="UaiFood Logo" />

      <form onSubmit={handleSubmit}>
        <h3 className="form-subtitle">Seus Dados</h3>
        {/* ... (inputs de nome, email, telefone, senha - SEM MUDANÇA) ... */}
        <div className="form-group">
          <label className="form-label">Nome Completo:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Telefone:</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Senha:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <h3 className="form-subtitle">Endereço de Entrega</h3>
        {/* ... (inputs de endereço - SEM MUDANÇA) ... */}
        <div className="form-group">
          <label className="form-label">Rua:</label>
          <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Número:</label>
          <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Bairro:</label>
          <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Cidade:</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Estado (ex: MG):</label>
          <input type="text" value={state} onChange={(e) => setState(e.target.value)} maxLength="2" />
        </div>
        <div className="form-group">
          <label className="form-label">CEP:</label>
          <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
        </div>
        
        {/* Removemos as tags <p> de erro/sucesso aqui embaixo */}
        
        <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default Register;
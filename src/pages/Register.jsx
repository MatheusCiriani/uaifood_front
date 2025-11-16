// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Form.css'; // <-- 1. IMPORTE O NOVO CSS

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados (sem mudança)
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
    setError('');
    setSuccess('');

    if (!name || !email || !password || !street || !number || !city) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const dataToSend = {
      name, email, phone, password, type: 'CLIENT',
      address: { street, number, district, city, state, zipCode },
    };

    try {
      await api.post('/users', dataToSend);
      setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Erro ao realizar o cadastro. Tente novamente.');
      }
    }
  };

  // 2. ADICIONE AS 'classNames'
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        
        <h3 className="form-subtitle">Seus Dados</h3>
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
        
        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}
        
        <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default Register;
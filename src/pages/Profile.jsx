// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/Form.css'; 

function Profile() {
  const { user, updateUserLocal } = useAuth();
  
  // Estados para Senha
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados para Endereço
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Carrega os dados iniciais do usuário e do endereço
  useEffect(() => {
    if (user) {
      // Se o usuário tem endereço, preenche os campos
      if (user.address) {
        setStreet(user.address.street || '');
        setNumber(user.address.number || '');
        setDistrict(user.address.district || '');
        setCity(user.address.city || '');
        setState(user.address.state || '');
        setZipCode(user.address.zipCode || '');
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validação básica
    if (password && password !== confirmPassword) {
      setError('As senhas não conferem.');
      setLoading(false);
      return;
    }

    if (!street || !number || !city || !state) {
      setError('Endereço incompleto.');
      setLoading(false);
      return;
    }

    try {
      // 1. Atualiza o Endereço (se tivermos o ID do endereço)
      let updatedAddress = user.address;
      
      if (user.address && user.address.id) {
        const addressData = { street, number, district, city, state, zipCode };
        const responseAddr = await api.put(`/addresses/${user.address.id}`, addressData);
        updatedAddress = responseAddr.data;
      }

      // 2. Atualiza a Senha (se o usuário digitou alguma)
      if (password) {
        await api.put(`/users/${user.id}`, { password });
      }

      // 3. Atualiza o Contexto Local (React + LocalStorage)
      // Criamos um novo objeto de usuário com o endereço atualizado
      const updatedUser = { 
        ...user, 
        address: updatedAddress 
      };
      
      updateUserLocal(updatedUser);

      setSuccess('Dados atualizados com sucesso!');
      setPassword('');
      setConfirmPassword('');
      
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Erro ao atualizar dados.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Meu Perfil</h2>

      <form onSubmit={handleSubmit}>
        
        {/* Dados Pessoais (Apenas Leitura) */}
        <h3 className="form-subtitle">Meus Dados</h3>
        <div className="form-group">
          <label className="form-label">Nome:</label>
          <input type="text" value={user?.name || ''} disabled style={{ backgroundColor: '#eee' }} />
        </div>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input type="text" value={user?.email || ''} disabled style={{ backgroundColor: '#eee' }} />
        </div>

        {/* Endereço (Editável) */}
        <h3 className="form-subtitle">Editar Endereço</h3>
        <div className="form-group">
          <label className="form-label">Rua:</label>
          <input type="text" value={street} onChange={e => setStreet(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Número:</label>
          <input type="text" value={number} onChange={e => setNumber(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Bairro:</label>
          <input type="text" value={district} onChange={e => setDistrict(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Cidade:</label>
          <input type="text" value={city} onChange={e => setCity(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Estado:</label>
          <input type="text" value={state} onChange={e => setState(e.target.value)} maxLength="2" required />
        </div>
        <div className="form-group">
          <label className="form-label">CEP:</label>
          <input type="text" value={zipCode} onChange={e => setZipCode(e.target.value)} />
        </div>

        {/* Senha (Editável) */}
        <h3 className="form-subtitle">Alterar Senha (Opcional)</h3>
        <div className="form-group">
          <label className="form-label">Nova Senha:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Deixe em branco para manter a atual"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Confirmar Nova Senha:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
        </div>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button type="submit" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>

      </form>
    </div>
  );
}

export default Profile;
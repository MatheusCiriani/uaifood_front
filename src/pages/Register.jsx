// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Nosso 'axios'

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estado para os campos do usuário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Estado para os campos do endereço
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

    // Validação simples (pode ser melhorada)
    if (!name || !email || !password || !street || !number || !city) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // 1. Monta o objeto aninhado que o backend espera
    const dataToSend = {
      name,
      email,
      phone,
      password,
      type: 'CLIENT', // Hardcoded como 'CLIENT'
      address: {
        street,
        number,
        district,
        city,
        state,
        zipCode,
      },
    };

    try {
      // 2. Chama a rota pública POST /users
      await api.post('/users', dataToSend);
      
      setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');

      // 3. Redireciona para o login após 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error); // Mostra o erro do backend (ex: "Email já em uso")
      } else {
        setError('Erro ao realizar o cadastro. Tente novamente.');
      }
    }
  };

  return (
    <div>
      <h2>Crie sua Conta no UaiFood</h2>
      <form onSubmit={handleSubmit}>
        {/* --- Dados do Usuário --- */}
        <h3>Seus Dados</h3>
        <div>
          <label>Nome Completo:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Telefone:</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label>Senha:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {/* --- Dados do Endereço --- */}
        <h3>Endereço de Entrega</h3>
        <div>
          <label>Rua:</label>
          <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} />
        </div>
        <div>
          <label>Número:</label>
          <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
        </div>
        <div>
          <label>Bairro:</label>
          <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} />
        </div>
        <div>
          <label>Cidade:</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div>
          <label>Estado (ex: MG):</label>
          <input type="text" value={state} onChange={(e) => setState(e.target.value)} maxLength="2" />
        </div>
        <div>
          <label>CEP:</label>
          <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
        </div>
        
        {/* --- Mensagens de Status --- */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default Register;
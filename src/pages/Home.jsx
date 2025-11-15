// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useCart } from '../context/CartContext'; // <-- 1. IMPORTE O USECART

function Home() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { addToCart } = useCart(); // <-- 2. PEGUE A FUNÇÃO 'addToCart'

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError('');
        const responseCategories = await api.get('/categories');
        setCategories(responseCategories.data);
        const responseItems = await api.get('/items');
        setItems(responseItems.data);
      } catch (err) {
        setError('Falha ao carregar o cardápio.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div><h2>Carregando cardápio...</h2></div>;
  if (error) return <div><h2 style={{ color: 'red' }}>{error}</h2></div>;

  return (
    <div>
      <h2>Cardápio UaiFood</h2>
      <p>Qualquer um, logado ou não, pode ver isso!</p>
      
      <hr />

      {/* Seção de Categorias */}
      <h3>Categorias</h3>
      <ul>
        {categories.map(category => (
          <li key={category.id}>{category.description}</li>
        ))}
      </ul>

      <hr />
      <h3>Itens Disponíveis</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {items.map(item => (
          <div 
            key={item.id} 
            style={{ 
              border: '1px solid #ccc', 
              padding: '10px', 
              margin: '10px', 
              width: '200px' 
            }}
          >
            <h4>{item.description}</h4>
            <p>Preço: R$ {item.unitPrice.toFixed(2)}</p>
            <small>Categoria: {item.category.description}</small>
            
            {/* 3. ADICIONE O BOTÃO */}
            <button onClick={() =>{addToCart(item)}} style={{ marginTop: '10px' }}>
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
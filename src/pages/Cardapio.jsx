// src/pages/Cardapio.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import './Cardapio.css'; // <-- MUDANÇA (importa o CSS renomeado)

function Cardapio() { // <-- MUDANÇA (nome do componente)
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError('');
        const [categoriesResponse, itemsResponse] = await Promise.all([
          api.get('/categories'),
          api.get('/items')
        ]);
        setCategories(categoriesResponse.data);
        setItems(itemsResponse.data);
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
    // <-- MUDANÇA (className)
    <div className="cardapio-container"> 
      <h2>Cardápio UaiFood</h2>
      <p>Qualquer um, logado ou não, pode ver isso!</p>
      
      <hr style={{ margin: '1rem 0' }} />

      {/* Seção de Categorias */}
      <h3>Categorias</h3>
      <ul className="category-list">
        {categories.map(category => (
          <li key={category.id}>{category.description}</li>
        ))}
      </ul>

      {/* Seção de Itens */}
      <h3>Itens Disponíveis</h3>
      <div className="item-list">
        {items.map(item => (
          <div key={item.id} className="item-card">
            <h4>{item.description}</h4>
            <p>R$ {item.unitPrice.toFixed(2)}</p>
            <small>Categoria: {item.category.description}</small>
            
            <button onClick={() => addToCart(item)}>
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cardapio; // <-- MUDANÇA (export)
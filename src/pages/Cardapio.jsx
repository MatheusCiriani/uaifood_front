// src/pages/Cardapio.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cardapio.css'; 
import logoUrl from '../assets/uaifood_lg.svg'; 

function Cardapio() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);

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
        setFeaturedItems(itemsResponse.data.slice(0, 5)); 

      } catch (err) {
        setError('Falha ao carregar o cardápio.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredItems = selectedCategory
    ? items.filter(item => item.categoryId === selectedCategory)
    : items; 

  if (loading) return <div><h2>Carregando cardápio...</h2></div>;
  if (error) return <div><h2 style={{ color: 'red' }}>{error}</h2></div>;

  return (
    <div className="cardapio-container"> 
      
      {/* Seção de Destaque */}
      <section className="featured-section">
        
        <img 
          src={logoUrl} 
          alt="Destaques UaiFood" 
          className="featured-title-logo" 
        />
        
        <div className="featured-list">
          {featuredItems.map(item => (
            <div key={item.id} className="item-card">
              
              {/* --- IMAGEM DO ITEM (Destaque) --- */}
              {item.image ? (
                <img 
                  src={`http://localhost:3000/uploads/${item.image}`} 
                  alt={item.description} 
                  className="item-card-image"
                />
              ) : (
                <div className="item-card-image placeholder">
                  Sem Foto
                </div>
              )}

              <div className="item-card-content">
                <h4>{item.description}</h4>
                <p>R$ {item.unitPrice.toFixed(2)}</p>
                <small>Categoria: {item.category.description}</small>
              </div>
              
              {user?.type !== 'ADMIN' && (
                <button onClick={() => addToCart(item)}>
                  Adicionar ao Carrinho
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Seção de Categorias (Filtros) */}
      <h3>Categorias</h3>
      <div className="category-list">
        <button
          onClick={() => setSelectedCategory(null)}
          className={selectedCategory === null ? 'active' : ''}
        >
          Todos
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={selectedCategory === category.id ? 'active' : ''}
          >
            {category.description}
          </button>
        ))}
      </div>

      {/* Seção de Itens (filtrados) */}
      <h3>Itens Disponíveis</h3>
      <div className="item-list">
        
        {filteredItems.map(item => (
          <div key={item.id} className="item-card">
            
            {/* --- IMAGEM DO ITEM (Lista Principal) --- */}
            {item.image ? (
              <img 
                src={`http://localhost:3000/uploads/${item.image}`} 
                alt={item.description} 
                className="item-card-image"
              />
            ) : (
              <div className="item-card-image placeholder">
                Sem Foto
              </div>
            )}

            <div className="item-card-content">
              <h4>{item.description}</h4>
              <p>R$ {item.unitPrice.toFixed(2)}</p>
              <small>Categoria: {item.category.description}</small>
            </div>
            
            {user?.type !== 'ADMIN' && (
              <button onClick={() => addToCart(item)}>
                Adicionar ao Carrinho
              </button>
            )}
          </div>
        ))}
        
        {filteredItems.length === 0 && items.length > 0 && (
          <p>Nenhum item encontrado nesta categoria.</p>
        )}
      </div>
    </div>
  );
}

export default Cardapio;
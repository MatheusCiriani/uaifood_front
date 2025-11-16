// src/pages/AdminManageItems.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
// 1. IMPORTE OS DOIS ARQUIVOS CSS
import '../styles/Form.css';
import "./AdminManageItems.css";

function AdminManageItems() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para o Formulário
  const [editItemId, setEditItemId] = useState(null); 
  const [description, setDescription] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');

  // (Função fetchData - sem mudanças)
  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsResponse, categoriesResponse] = await Promise.all([
        api.get('/items'),
        api.get('/categories')
      ]);
      setItems(itemsResponse.data);
      setCategories(categoriesResponse.data);
      if (categoriesResponse.data.length > 0 && !categoryId) {
        setCategoryId(categoriesResponse.data[0].id);
      }
    } catch (err) {
      setError('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // (Função handleDelete - sem mudanças)
  const handleDelete = async (itemId) => {
    if (window.confirm('Tem certeza que deseja deletar este item?')) {
      try {
        await api.delete(`/items/${itemId}`);
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      } catch (err) {
        alert('Erro ao deletar o item.');
      }
    }
  };
  
  // (Função handleSubmit - sem mudanças na lógica)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !unitPrice || !categoryId) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    const itemData = {
      description,
      unitPrice: parseFloat(unitPrice),
      categoryId: categoryId 
    };
    try {
      if (editItemId) {
        const response = await api.put(`/items/${editItemId}`, itemData);
        setItems(prevItems => 
          prevItems.map(item => item.id === editItemId ? response.data : item)
        );
        alert('Item atualizado com sucesso!');
      } else {
        const response = await api.post('/items', itemData);
        setItems(prevItems => [...prevItems, response.data]);
        alert('Item criado com sucesso!');
      }
      setEditItemId(null);
      setDescription('');
      setUnitPrice('');
      setCategoryId(categories.length > 0 ? categories[0].id : '');
    } catch (err) {
      console.error("ERRO DETALHADO:", err);
      if (err.response && err.response.data && err.response.data.error) {
        alert('Erro do Backend: ' + err.response.data.error);
      } else {
        alert('Erro ao salvar o item. Verifique o console (F12).');
      }
    }
  };

  // (Função startEdit - sem mudanças)
  const startEdit = (item) => {
    setEditItemId(item.id);
    setDescription(item.description);
    setUnitPrice(item.unitPrice);
    setCategoryId(item.categoryId);
    window.scrollTo(0, 0); 
  };

  if (loading) return <h2>Carregando...</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;

  // --- 2. ATUALIZE O JSX COM AS CLASSES ---
  return (
    <div>
      {/* --- Formulário de Criação/Edição (Usa Form.css) --- */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {/* O título muda se estiver editando ou criando */}
          <h2 className="form-title">
            {editItemId ? 'Editar Item' : 'Criar Novo Item'}
          </h2>
          
          <div className="form-group">
            <label className="form-label">Descrição:</label>
            <input 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Preço (ex: 10.50):</label>
            <input 
              type="number" 
              step="0.01"
              value={unitPrice} 
              onChange={(e) => setUnitPrice(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Categoria:</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.length === 0 && <option>Carregando...</option>}
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.description}
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit" style={{ width: '100%' }}>
            {editItemId ? 'Atualizar Item' : 'Salvar Novo Item'}
          </button>
          {editItemId && (
            <button type="button" onClick={() => setEditItemId(null)} style={{ width: '100%', marginTop: '10px', backgroundColor: '#777' }}>
              Cancelar Edição
            </button>
          )}
        </form>
      </div>

      {/* --- Lista de Itens Existentes (Usa AdminManageItems.css) --- */}
      <div className="item-list-container">
        <h3 className="item-list-title">Itens Atuais</h3>
        {items.map(item => (
          <div key={item.id} className="admin-item-card">
            <div className="admin-item-info">
              <h4>{item.description}</h4>
              <small>R$ {item.unitPrice.toFixed(2)} (Cat: {item.category.description})</small>
            </div>
            <div className="admin-item-actions">
              <button onClick={() => startEdit(item)}>Editar</button>
              <button onClick={() => handleDelete(item.id)} className="delete-btn">
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminManageItems;
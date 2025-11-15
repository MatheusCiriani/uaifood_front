// src/pages/AdminManageItems.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

function AdminManageItems() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Estados para o Formulário ---
  const [editItemId, setEditItemId] = useState(null); 
  const [description, setDescription] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');

  // 1. Função para carregar Itens E Categorias
  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsResponse, categoriesResponse] = await Promise.all([
        api.get('/items'),
        api.get('/categories')
      ]);
      setItems(itemsResponse.data);
      setCategories(categoriesResponse.data);
      if (categoriesResponse.data.length > 0) {
        setCategoryId(categoriesResponse.data[0].id);
      }
    } catch (err) {
      setError('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Carrega os dados quando a página abre
  useEffect(() => {
    fetchData();
  }, []);

  // 3. Função para Deletar um Item
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

  // 4. Função do Formulário (Criar ou Editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !unitPrice || !categoryId) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const itemData = {
      description,
      unitPrice: parseFloat(unitPrice),
      categoryId: categoryId // Garante que é BigInt para o Prisma
    };

    try {
      if (editItemId) {
        // --- Modo Edição (UPDATE) ---
        const response = await api.put(`/items/${editItemId}`, itemData);
        setItems(prevItems => 
          prevItems.map(item => item.id === editItemId ? response.data : item)
        );
        alert('Item atualizado com sucesso!');
      } else {
        // --- Modo Criação (CREATE) ---
        const response = await api.post('/items', itemData);
        setItems(prevItems => [...prevItems, response.data]);
        alert('Item criado com sucesso!');
      }
      
      // Limpa o formulário
      setEditItemId(null);
      setDescription('');
      setUnitPrice('');
      setCategoryId(categories.length > 0 ? categories[0].id : '');

    } catch (err) {
      // --- MUDANÇA AQUI ---
      // Vamos mostrar o erro específico do backend
      console.error("ERRO DETALHADO:", err); // Loga o erro completo no console
      
      if (err.response && err.response.data && err.response.data.error) {
        // Se o backend enviou uma mensagem de erro (ex: { "error": "Categoria não existe" })
        alert('Erro do Backend: ' + err.response.data.error);
      } else {
        // Se for um erro de rede ou outro problema
        alert('Erro ao salvar o item. Verifique o console (F12).');
      }
    }
  };

  // 5. Função para carregar o form com dados de um item
  const startEdit = (item) => {
    setEditItemId(item.id);
    setDescription(item.description);
    setUnitPrice(item.unitPrice);
    setCategoryId(item.categoryId);
    window.scrollTo(0, 0);
  };

  // --- Renderização ---
  if (loading) return <h2>Carregando...</h2>;
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>;

  return (
    <div>
      <h2>Gerenciamento de Itens do Cardápio</h2>
      
      {/* --- Formulário de Criação/Edição --- */}
      <form onSubmit={handleSubmit} style={{ background: '#f4f4f4', padding: '15px', marginBottom: '20px' }}>
        <h3>{editItemId ? 'Editar Item' : 'Criar Novo Item'}</h3>
        
        <div>
          <label>Descrição:</label>
          <input 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Preço (ex: 10.50):</label>
          <input 
            type="number" 
            step="0.01"
            value={unitPrice} 
            onChange={(e) => setUnitPrice(e.target.value)}
          />
        </div>
        <div>
          <label>Categoria:</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {/* Adiciona uma opção 'Selecione' se nenhuma categoria estiver carregada */}
            {categories.length === 0 && <option>Carregando...</option>}
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.description}
              </option>
            ))}
          </select>
        </div>
        
        <button type="submit" style={{ marginTop: '10px' }}>
          {editItemId ? 'Atualizar Item' : 'Salvar Novo Item'}
        </button>
        {editItemId && (
          <button type="button" onClick={() => setEditItemId(null)} style={{ marginLeft: '10px' }}>
            Cancelar Edição
          </button>
        )}
      </form>

      {/* --- Lista de Itens Existentes --- */}
      <h3>Itens Atuais</h3>
      {items.map(item => (
        <div key={item.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
          <h4>{item.description} (R$ {item.unitPrice.toFixed(2)})</h4>
          <small>Categoria: {item.category.description}</small>
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => startEdit(item)}>Editar</button>
            <button onClick={() => handleDelete(item.id)} style={{ marginLeft: '10px', color: 'red' }}>
              Deletar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminManageItems;
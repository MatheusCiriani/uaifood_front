// src/pages/AdminManageItems.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Form.css';
import './AdminManageItems.css';
import { toast } from 'react-toastify'; 
function AdminManageItems() {
  // ... (estados iguais) ...
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Esse 'error' é para falha no carregamento inicial

  const [editItemId, setEditItemId] = useState(null); 
  const [description, setDescription] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); 
  const [preview, setPreview] = useState(null); 

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
      toast.error('Erro ao carregar dados do servidor.'); // <-- TOAST
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (itemId) => {
    // O window.confirm NATIVO ainda é útil para confirmação crítica, pode manter ou criar um modal customizado.
    // Vamos manter por simplicidade, mas usar toast no resultado.
    if (window.confirm('Tem certeza que deseja deletar este item?')) {
      try {
        await api.delete(`/items/${itemId}`);
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        toast.success('Item deletado com sucesso.'); // <-- TOAST
      } catch (err) {
        toast.error('Erro ao deletar o item.'); // <-- TOAST
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description || !unitPrice || !categoryId) {
      toast.warn('Preencha descrição, preço e categoria.'); // <-- TOAST
      return;
    }

    const data = new FormData();
    data.append('description', description);
    data.append('unitPrice', unitPrice);
    data.append('categoryId', categoryId);
    if (selectedImage) {
      data.append('image', selectedImage); 
    }

    try {
      let response;
      if (editItemId) {
        response = await api.put(`/items/${editItemId}`, data); 
        setItems(prev => prev.map(i => i.id === editItemId ? response.data : i));
        toast.success('Item atualizado com sucesso!'); // <-- TOAST
      } else {
        response = await api.post('/items', data);
        setItems(prev => [...prev, response.data]);
        toast.success('Item criado com sucesso!'); // <-- TOAST
      }
      
      setEditItemId(null);
      setDescription('');
      setUnitPrice('');
      setSelectedImage(null);
      setPreview(null);
      document.getElementById('fileInput').value = ''; 
      
    } catch (err) {
      console.error("Erro:", err);
      const errorMsg = err.response?.data?.error || 'Erro ao salvar.';
      toast.error(errorMsg); // <-- TOAST
    }
  };

  const startEdit = (item) => {
    setEditItemId(item.id);
    setDescription(item.description);
    setUnitPrice(item.unitPrice);
    setCategoryId(item.categoryId);
    setPreview(item.image ? `http://localhost:3000/uploads/${item.image}` : null);
    setSelectedImage(null); 
    window.scrollTo(0, 0);
  };

  if (loading) return <h2>Carregando...</h2>;

  // ... (O return do JSX continua igual, apenas certifique-se de que não há <p>{error}</p> soltos) ...
  return (
    <div>
      <div className="form-container">
        {/* ... (seu formulário igual) ... */}
        <form onSubmit={handleSubmit}>
            <h2 className="form-title">{editItemId ? 'Editar' : 'Novo'} Item</h2>
            {/* ... inputs ... */}
            <div className="form-group">
                <label className="form-label">Foto do Item:</label>
                <input type="file" id="fileInput" onChange={handleFileChange} accept="image/*" />
                {preview && <img src={preview} alt="Preview" className="image-preview-form" />}
            </div>
            <div className="form-group">
                <label className="form-label">Descrição:</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="form-group">
                <label className="form-label">Preço:</label>
                <input type="number" step="0.01" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} />
            </div>
            <div className="form-group">
                <label className="form-label">Categoria:</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.description}</option>)}
                </select>
            </div>
            <button type="submit" style={{ width: '100%' }}>Salvar</button>
            {editItemId && <button type="button" onClick={() => {
                setEditItemId(null); setPreview(null); setDescription(''); setUnitPrice('');
            }} style={{ width: '100%', marginTop: '10px', background: '#777' }}>Cancelar</button>}
        </form>
      </div>

      <div className="item-list-container">
        <h3 className="item-list-title">Itens Atuais</h3>
        {items.map(item => (
          <div key={item.id} className="admin-item-card">
            {item.image && (
              <img 
                src={`http://localhost:3000/uploads/${item.image}`} 
                alt={item.description} 
                className="admin-item-thumb"
              />
            )}
            <div className="admin-item-info">
              <h4>{item.description}</h4>
              <small>R$ {item.unitPrice.toFixed(2)}</small>
            </div>
            <div className="admin-item-actions">
              <button onClick={() => startEdit(item)}>Editar</button>
              <button onClick={() => handleDelete(item.id)} className="delete-btn">X</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminManageItems;
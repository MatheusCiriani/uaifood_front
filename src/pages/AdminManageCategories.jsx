// src/pages/AdminManageCategories.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Form.css';
import './AdminManageCategories.css'; 
import { toast } from 'react-toastify'; // <-- 1. IMPORTE

function AdminManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados do Formulário
  const [editId, setEditId] = useState(null);
  const [description, setDescription] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      toast.error('Erro ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) {
        toast.warn("Digite o nome da categoria.");
        return;
    }

    try {
      if (editId) {
        const response = await api.put(`/categories/${editId}`, { description });
        setCategories(prev => prev.map(cat => cat.id === editId ? response.data : cat));
        toast.success('Categoria atualizada com sucesso!');
      } else {
        const response = await api.post('/categories', { description });
        setCategories(prev => [...prev, response.data]);
        toast.success('Categoria criada com sucesso!');
      }
      setEditId(null);
      setDescription('');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar categoria.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza? Isso pode falhar se houver itens nesta categoria.')) {
      try {
        await api.delete(`/categories/${id}`);
        setCategories(prev => prev.filter(cat => cat.id !== id));
        toast.success('Categoria removida.');
      } catch (err) {
        // Backend retorna erro 500 ou 409 se tiver itens vinculados
        toast.error('Erro ao deletar. Verifique se existem itens nesta categoria.');
      }
    }
  };

  const startEdit = (category) => {
    setEditId(category.id);
    setDescription(category.description);
    window.scrollTo(0, 0);
  };

  if (loading) return <h2>Carregando...</h2>;

  return (
    <div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2 className="form-title">
            {editId ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          <div className="form-group">
            <label className="form-label">Nome da Categoria:</label>
            <input 
              type="text" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Ex: Bebidas"
              required
            />
          </div>
          <button type="submit" style={{ width: '100%' }}>
            {editId ? 'Atualizar' : 'Salvar'}
          </button>
          {editId && (
            <button 
              type="button" 
              onClick={() => { setEditId(null); setDescription(''); }} 
              style={{ width: '100%', marginTop: '10px', background: '#777' }}
            >
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="category-list-container">
        <h3 className="category-list-title">Categorias Atuais</h3>
        {categories.map(category => (
          <div key={category.id} className="admin-category-card">
            <div className="admin-category-info">
              <h4>{category.description}</h4>
            </div>
            <div className="admin-category-actions">
              <button onClick={() => startEdit(category)}>Editar</button>
              <button onClick={() => handleDelete(category.id)} className="delete-btn">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminManageCategories;
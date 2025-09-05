import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import { Product } from '../types';

interface ProductFormData {
  name: string;
  unit: 'kg' | 'g' | 'l' | 'ml' | 'pcs';
  quantity: string;
  price: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    unit: 'kg',
    quantity: '',
    price: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      setError('Ошибка при загрузке продуктов');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        unit: formData.unit,
        quantity: parseFloat(formData.quantity),
        price: parseFloat(formData.price)
      };
      
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData);
      } else {
        await productsAPI.create(productData);
      }
      await fetchProducts();
      resetForm();
    } catch (err) {
      setError('Ошибка при сохранении продукта');
      console.error(err);
    }
  };

  const handleEdit = (product: Product): void => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      unit: product.unit,
      quantity: product.quantity.toString(),
      price: product.price.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Вы уверены, что хотите удалить этот продукт?')) {
      try {
        await productsAPI.delete(id);
        await fetchProducts();
      } catch (err) {
        setError('Ошибка при удалении продукта');
        console.error(err);
      }
    }
  };

  const resetForm = (): void => {
    setFormData({
      name: '',
      unit: 'kg',
      quantity: '',
      price: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Загрузка продуктов...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>Управление продуктами</h2>
        
        {error && <div className="error">{error}</div>}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Поиск продуктов..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            style={{ width: '300px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <button 
            className="btn btn-success" 
            onClick={() => setShowForm(true)}
          >
            Добавить продукт
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
            <h3>{editingProduct ? 'Редактировать продукт' : 'Добавить новый продукт'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Название продукта</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Единица измерения</label>
                  <select
                    value={formData.unit}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, unit: e.target.value as 'kg' | 'g' | 'l' | 'ml' | 'pcs'})}
                  >
                    <option value="kg">Килограмм</option>
                    <option value="g">Грамм</option>
                    <option value="l">Литр</option>
                    <option value="ml">Миллилитр</option>
                    <option value="pcs">Штука</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Количество</label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.quantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, quantity: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Цена (₽)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
              <div>
                <button type="submit" className="btn">
                  {editingProduct ? 'Обновить' : 'Добавить'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Количество</th>
              <th>Единица</th>
              <th>Цена</th>
              <th>Цена за единицу</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.unit === 'kg' ? 'кг' : 
                     product.unit === 'g' ? 'г' :
                     product.unit === 'l' ? 'л' :
                     product.unit === 'ml' ? 'мл' : 'шт'}</td>
                <td>{product.price}₽</td>
                <td>{parseFloat(product.price_per_unit.toString()).toFixed(2)}₽</td>
                <td>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleEdit(product)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(product.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProducts.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
            {searchTerm ? 'Продукты не найдены' : 'Продукты не добавлены'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;

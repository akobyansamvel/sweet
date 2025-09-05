import React, { useState, useEffect } from 'react';
import { recipesAPI, productsAPI } from '../services/api';
import { Recipe, Product, CostCalculation } from '../types';

interface RecipeFormData {
  name: string;
  description: string;
  ingredients: {
    product: number;
    quantity: number;
  }[];
}

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [formData, setFormData] = useState<RecipeFormData>({
    name: '',
    description: '',
    ingredients: []
  });
  const [costCalculation, setCostCalculation] = useState<CostCalculation | null>(null);

  useEffect(() => {
    fetchRecipes();
    fetchProducts();
  }, []);

  const fetchRecipes = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await recipesAPI.getAll();
      setRecipes(response.data);
    } catch (err) {
      setError('Ошибка при загрузке рецептов');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (): Promise<void> => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      console.error('Ошибка при загрузке продуктов:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      if (editingRecipe) {
        await recipesAPI.update(editingRecipe.id, formData);
      } else {
        await recipesAPI.create(formData);
      }
      await fetchRecipes();
      resetForm();
    } catch (err) {
      setError('Ошибка при сохранении рецепта');
      console.error(err);
    }
  };

  const handleEdit = (recipe: Recipe): void => {
    setEditingRecipe(recipe);
    setFormData({
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients.map(ing => ({
        product: ing.product,
        quantity: ing.quantity
      }))
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Вы уверены, что хотите удалить этот рецепт?')) {
      try {
        await recipesAPI.delete(id);
        await fetchRecipes();
      } catch (err) {
        setError('Ошибка при удалении рецепта');
        console.error(err);
      }
    }
  };

  const handleCalculateCost = async (recipeId: number): Promise<void> => {
    try {
      const response = await recipesAPI.calculateCost(recipeId);
      setCostCalculation(response.data);
    } catch (err) {
      setError('Ошибка при расчете стоимости');
      console.error(err);
    }
  };

  const addIngredient = (): void => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { product: 0, quantity: 0 }]
    });
  };

  const removeIngredient = (index: number): void => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const updateIngredient = (index: number, field: 'product' | 'quantity', value: number): void => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const resetForm = (): void => {
    setFormData({
      name: '',
      description: '',
      ingredients: []
    });
    setEditingRecipe(null);
    setShowForm(false);
    setCostCalculation(null);
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Загрузка рецептов...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>Управление рецептами</h2>
        
        {error && <div className="error">{error}</div>}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Поиск рецептов..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            style={{ width: '300px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <button 
            className="btn btn-success" 
            onClick={() => setShowForm(true)}
          >
            Добавить рецепт
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
            <h3>{editingRecipe ? 'Редактировать рецепт' : 'Добавить новый рецепт'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Название рецепта</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <h4>Ингредиенты:</h4>
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-row">
                  <select
                    value={ingredient.product}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateIngredient(index, 'product', parseInt(e.target.value))}
                    required
                  >
                    <option value={0}>Выберите продукт</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.quantity} {product.unit})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="Количество"
                    value={ingredient.quantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateIngredient(index, 'quantity', parseFloat(e.target.value))}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeIngredient(index)}
                  >
                    Удалить
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addIngredient}
                style={{ marginBottom: '1rem' }}
              >
                Добавить ингредиент
              </button>
              
              <div>
                <button type="submit" className="btn">
                  {editingRecipe ? 'Обновить' : 'Добавить'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {costCalculation && (
          <div className="cost-display">
            <h3>Расчет стоимости: {costCalculation.recipe_name}</h3>
            <div className="cost-item">
              <span>Базовая стоимость:</span>
              <span>{costCalculation.base_cost}₽</span>
            </div>
            <div className="cost-item">
              <span>Наценка ({costCalculation.markup_percent}%):</span>
              <span>{costCalculation.markup_amount}₽</span>
            </div>
            <div className="cost-total">
              <span>Итого:</span>
              <span>{costCalculation.total_cost}₽</span>
            </div>
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Описание</th>
              <th>Ингредиентов</th>
              <th>Стоимость</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecipes.map(recipe => (
              <tr key={recipe.id}>
                <td>{recipe.name}</td>
                <td>{recipe.description}</td>
                <td>{recipe.ingredients_count}</td>
                <td>{recipe.total_cost}₽</td>
                <td>
                  <button 
                    className="btn" 
                    onClick={() => handleCalculateCost(recipe.id)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    Рассчитать
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleEdit(recipe)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(recipe.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredRecipes.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
            {searchTerm ? 'Рецепты не найдены' : 'Рецепты не добавлены'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Recipes;

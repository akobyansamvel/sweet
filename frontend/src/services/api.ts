import axios, { AxiosResponse } from 'axios';
import { 
  Product, 
  Recipe, 
  RecipeCreateUpdate, 
  RecipeIngredient, 
  Setting, 
  CostCalculation 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsAPI = {
  getAll: (): Promise<AxiosResponse<Product[]>> => api.get('/products/'),
  getById: (id: number): Promise<AxiosResponse<Product>> => api.get(`/products/${id}/`),
  create: (data: Omit<Product, 'id' | 'price_per_unit' | 'created_at' | 'updated_at'>): Promise<AxiosResponse<Product>> => 
    api.post('/products/', data),
  update: (id: number, data: Partial<Omit<Product, 'id' | 'price_per_unit' | 'created_at' | 'updated_at'>>): Promise<AxiosResponse<Product>> => 
    api.put(`/products/${id}/`, data),
  delete: (id: number): Promise<AxiosResponse<void>> => api.delete(`/products/${id}/`),
  search: (query: string): Promise<AxiosResponse<Product[]>> => api.get(`/products/?search=${query}`),
};

// Recipes API
export const recipesAPI = {
  getAll: (): Promise<AxiosResponse<Recipe[]>> => api.get('/recipes/'),
  getById: (id: number): Promise<AxiosResponse<Recipe>> => api.get(`/recipes/${id}/`),
  create: (data: RecipeCreateUpdate): Promise<AxiosResponse<Recipe>> => api.post('/recipes/', data),
  update: (id: number, data: RecipeCreateUpdate): Promise<AxiosResponse<Recipe>> => api.put(`/recipes/${id}/`, data),
  delete: (id: number): Promise<AxiosResponse<void>> => api.delete(`/recipes/${id}/`),
  search: (query: string): Promise<AxiosResponse<Recipe[]>> => api.get(`/recipes/?search=${query}`),
  calculateCost: (id: number): Promise<AxiosResponse<CostCalculation>> => api.post(`/recipes/${id}/calculate_cost/`),
};

// Recipe Ingredients API
export const recipeIngredientsAPI = {
  getAll: (): Promise<AxiosResponse<RecipeIngredient[]>> => api.get('/recipe-ingredients/'),
  getByRecipe: (recipeId: number): Promise<AxiosResponse<RecipeIngredient[]>> => 
    api.get(`/recipe-ingredients/?recipe=${recipeId}`),
  create: (data: Omit<RecipeIngredient, 'id' | 'product_name' | 'product_unit' | 'cost'>): Promise<AxiosResponse<RecipeIngredient>> => 
    api.post('/recipe-ingredients/', data),
  update: (id: number, data: Partial<Omit<RecipeIngredient, 'id' | 'product_name' | 'product_unit' | 'cost'>>): Promise<AxiosResponse<RecipeIngredient>> => 
    api.put(`/recipe-ingredients/${id}/`, data),
  delete: (id: number): Promise<AxiosResponse<void>> => api.delete(`/recipe-ingredients/${id}/`),
};

// Settings API
export const settingsAPI = {
  getAll: (): Promise<AxiosResponse<Setting[]>> => api.get('/settings/'),
  getById: (id: number): Promise<AxiosResponse<Setting>> => api.get(`/settings/${id}/`),
  create: (data: Omit<Setting, 'id' | 'created_at' | 'updated_at'>): Promise<AxiosResponse<Setting>> => 
    api.post('/settings/', data),
  update: (id: number, data: Partial<Omit<Setting, 'id' | 'created_at' | 'updated_at'>>): Promise<AxiosResponse<Setting>> => 
    api.put(`/settings/${id}/`, data),
  delete: (id: number): Promise<AxiosResponse<void>> => api.delete(`/settings/${id}/`),
  getByName: (name: string): Promise<AxiosResponse<Setting[]>> => api.get(`/settings/?name=${name}`),
};

export default api;

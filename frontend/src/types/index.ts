export interface Product {
  id: number;
  name: string;
  unit: 'kg' | 'g' | 'l' | 'ml' | 'pcs';
  quantity: number;
  price: number;
  price_per_unit: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id: number;
  product: number;
  product_name: string;
  product_unit: string;
  quantity: number;
  cost: number;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  total_cost: number;
  ingredients_count: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeCreateUpdate {
  name: string;
  description: string;
  ingredients: {
    product: number;
    quantity: number;
  }[];
}

export interface Setting {
  id: number;
  name: string;
  value: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CostCalculation {
  recipe_id: number;
  recipe_name: string;
  base_cost: number;
  markup_percent: number;
  markup_amount: number;
  total_cost: number;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  message: string;
  details?: any;
}

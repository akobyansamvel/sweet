import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Products from './components/Products';
import Recipes from './components/Recipes';
import Settings from './components/Settings';
import './App.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <nav className="nav">
      <Link 
        to="/products" 
        className={`nav-button ${isActive('/products') ? 'active' : ''}`}
      >
        Продукты
      </Link>
      <Link 
        to="/recipes" 
        className={`nav-button ${isActive('/recipes') ? 'active' : ''}`}
      >
        Рецепты
      </Link>
      <Link 
        to="/settings" 
        className={`nav-button ${isActive('/settings') ? 'active' : ''}`}
      >
        Настройки
      </Link>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <header className="header">
            <h1>🍰 Калькулятор кондитерских изделий</h1>
            <p>Управление продуктами, рецептами и расчет стоимости</p>
          </header>
          
          <Navigation />
          
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/products" element={<Products />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

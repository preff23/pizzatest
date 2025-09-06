import React, { useState, useMemo } from 'react';
import { PizzaCard } from '../components/PizzaCard';
import { MENU } from '../data/menu';

export const MenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'Pizza' | 'Vegan'>('Pizza');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMenu = useMemo(() => {
    return MENU.filter(item => {
      const matchesCategory = item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="menu-page">
      <div className="menu-page__controls">
        <div className="category-tabs">
          <button
            className={`category-tabs__item ${selectedCategory === 'Pizza' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Pizza')}
          >
            Pizza
          </button>
          <button
            className={`category-tabs__item ${selectedCategory === 'Vegan' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('Vegan')}
          >
            Vegan
          </button>
        </div>
        
        <div className="search-field">
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-field__input"
          />
        </div>
      </div>

      <div className="menu-page__content">
        {filteredMenu.length > 0 ? (
          <div className="pizza-grid">
            {filteredMenu.map(item => (
              <PizzaCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
};

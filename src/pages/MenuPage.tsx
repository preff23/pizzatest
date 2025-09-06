import React, { useState, useMemo } from 'react';
import { PizzaCard } from '../components/PizzaCard';
import { MENU } from '../data/menu';

export const MenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'Pizza' | 'Vegan'>('Pizza');

  const filteredMenu = useMemo(() => {
    return MENU.filter(item => {
      const matchesCategory = item.category === selectedCategory;
      return matchesCategory;
    });
  }, [selectedCategory]);

  return (
    <div>
      <div className="segments">
        <button
          className={`segment ${selectedCategory === 'Pizza' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('Pizza')}
        >
          Pizza
        </button>
        <button
          className={`segment ${selectedCategory === 'Vegan' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('Vegan')}
        >
          Vegan
        </button>
      </div>

      {filteredMenu.length > 0 ? (
        <div>
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
  );
};

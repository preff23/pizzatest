import React, { useState, useMemo } from 'react';
import Hero from '../components/Hero';
import SegmentedChips from '../components/SegmentedChips';
import CurvedSection from '../components/CurvedSection';
import DishCard from '../components/DishCard';
import { MENU } from '../data/menu';
import { useCart } from '../store/cartContext';

export const MenuPage: React.FC = () => {
  const { add } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<'Pizza' | 'Vegan'>('Pizza');

  const filteredMenu = useMemo(() => {
    return MENU.filter(item => {
      const matchesCategory = item.category === selectedCategory;
      return matchesCategory;
    });
  }, [selectedCategory]);

  const tabs = [
    { 
      key: 'Pizza', 
      label: 'Pizza', 
      count: MENU.filter(item => item.category === 'Pizza').length 
    },
    { 
      key: 'Vegan', 
      label: 'Vegan', 
      count: MENU.filter(item => item.category === 'Vegan').length 
    },
  ];

  const handleAddToCart = (item: typeof MENU[0]) => {
    add({
      id: item.id,
      name: item.name,
      price: item.price,
    });
    
    // Показываем мини-тост
    if (window.Telegram?.WebApp?.showAlert) {
      window.Telegram.WebApp.showAlert('Добавлено в корзину!');
    } else {
      alert('Добавлено в корзину!');
    }
  };

  return (
    <div className="container">
      <Hero />
      <SegmentedChips 
        tabs={tabs} 
        active={selectedCategory} 
        onChange={(key) => setSelectedCategory(key as 'Pizza' | 'Vegan')} 
      />
      <CurvedSection>
        {filteredMenu.map(item => (
          <div key={item.id}>
            <DishCard 
              dish={{
                id: item.id,
                name: item.name,
                desc: item.desc,
                price: item.price,
                badges: item.category === 'Vegan' ? ['🌿', '🥦'] : ['🍕']
              }} 
              onAdd={() => handleAddToCart(item)}
            />
            <div className="sep" />
          </div>
        ))}
      </CurvedSection>
    </div>
  );
};

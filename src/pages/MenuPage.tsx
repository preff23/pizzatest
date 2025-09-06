import React, { useState, useMemo } from 'react';
import SegmentedChips from '../components/SegmentedChips';
import CurvedSection from '../components/CurvedSection';
import DishCard from '../components/DishCard';
import Toast from '../components/Toast';
import { MENU } from '../data/menu';
import { useCart } from '../store/cartContext';

export const MenuPage: React.FC = () => {
  const { add } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<'Pizza' | 'Vegan'>('Pizza');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    
    // Показываем Toast
    setToastMessage('Добавлено');
  };

  return (
    <div className="container">
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
      
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  );
};

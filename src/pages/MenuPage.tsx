import React, { useState, useMemo } from 'react';
import SegmentedChips from '../components/SegmentedChips';
import QtyButton from '../components/QtyButton';
import Toast from '../components/Toast';
import { HalfBuilderPage } from './HalfBuilderPage';
import { MENU } from '../data/menu';
import { useCart } from '../store/cartContext';

export const MenuPage: React.FC = () => {
  const { add, remove } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<'Pizza' | 'Build'>('Pizza');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [listVisible, setListVisible] = useState(true);

  const filteredMenu = useMemo(() => {
    if (selectedCategory === 'Build') return [];
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
      key: 'Build', 
      label: 'Собрать'
    },
  ];

  const handleCategoryChange = (key: string) => {
    const newCategory = key as 'Pizza' | 'Build';
    
    if (newCategory === 'Build') {
      setSelectedCategory(newCategory);
      return;
    }
    
    // Hide list with animation
    setListVisible(false);
    setIsLoading(true);
    
    setTimeout(() => {
      setSelectedCategory(newCategory);
      setListVisible(true);
      setIsLoading(false);
    }, 200);
  };

  const handleAddToCart = (item: typeof MENU[0]) => {
    add({
      id: item.id,
      name: item.name,
      price: item.price,
    });

    setToastMessage('Добавлено в корзину');
    
    // Haptic feedback
    if ((window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred) {
      (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  const handleRemoveFromCart = (item: typeof MENU[0]) => {
    remove(item.id);
    
    // Haptic feedback
    if ((window as any).Telegram?.WebApp?.HapticFeedback?.selectionChanged) {
      (window as any).Telegram.WebApp.HapticFeedback.selectionChanged();
    }
  };

  if (selectedCategory === 'Build') {
    return <HalfBuilderPage />;
  }

  return (
    <div className="container">
      <SegmentedChips 
        tabs={tabs} 
        active={selectedCategory} 
        onChange={handleCategoryChange} 
      />
      <h2 className="section-title">{selectedCategory.toUpperCase()}</h2>
      <div className="section-rule"></div>
      
      <div className={`list-anim ${listVisible ? 'show' : ''}`}>
        {isLoading ? (
          // Skeleton loading
          <>
            <div className="skel"></div>
            <div className="skel"></div>
            <div className="skel"></div>
          </>
        ) : (
          filteredMenu.map(item => (
            <div key={item.id} className="row">
              <div>
                <h3>{item.name}</h3>
                <p className="desc">{item.desc}</p>
              </div>
              <div className="aside">
                <div className="price">{item.price.toLocaleString('ru-RU')} ₽</div>
                <QtyButton
                  itemId={item.id}
                  onAdd={() => handleAddToCart(item)}
                  onRemove={() => handleRemoveFromCart(item)}
                />
              </div>
            </div>
          ))
        )}
      </div>
      
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { MenuItem } from '../types';

interface HalfPizzaSelectorProps {
  currentPizza: MenuItem;
  allPizzas: MenuItem[];
  onAddHalf: (leftId: string, rightId: string, leftName: string, rightName: string, leftPrice: number, rightPrice: number) => void;
  onClose: () => void;
}

export const HalfPizzaSelector: React.FC<HalfPizzaSelectorProps> = ({
  currentPizza,
  allPizzas,
  onAddHalf,
  onClose
}) => {
  const [selectedPizza, setSelectedPizza] = useState<MenuItem | null>(null);

  const handleAddHalf = () => {
    if (selectedPizza) {
      onAddHalf(
        currentPizza.id,
        selectedPizza.id,
        currentPizza.name,
        selectedPizza.name,
        currentPizza.price,
        selectedPizza.price
      );
      onClose();
    }
  };

  const availablePizzas = allPizzas.filter(pizza => pizza.id !== currentPizza.id);

  return (
    <div className="half-pizza-modal">
      <div className="half-pizza-content">
        <div className="half-pizza-header">
          <h3>Выберите вторую половинку</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="half-pizza-info">
          <div className="selected-pizza">
            <span className="pizza-name">{currentPizza.name}</span>
            <span className="pizza-price">{currentPizza.price} ₽</span>
          </div>
          <div className="plus-sign">+</div>
          <div className="selected-pizza">
            <span className="pizza-name">
              {selectedPizza ? selectedPizza.name : 'Выберите пиццу'}
            </span>
            <span className="pizza-price">
              {selectedPizza ? `${selectedPizza.price} ₽` : ''}
            </span>
          </div>
        </div>

        <div className="pizza-list">
          {availablePizzas.map(pizza => (
            <button
              key={pizza.id}
              className={`pizza-option ${selectedPizza?.id === pizza.id ? 'selected' : ''}`}
              onClick={() => setSelectedPizza(pizza)}
            >
              <span className="pizza-name">{pizza.name}</span>
              <span className="pizza-price">{pizza.price} ₽</span>
            </button>
          ))}
        </div>

        <div className="half-pizza-actions">
          <button
            className="button button--secondary"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className="button button--primary"
            onClick={handleAddHalf}
            disabled={!selectedPizza}
          >
            Добавить половинки
          </button>
        </div>
      </div>
    </div>
  );
};

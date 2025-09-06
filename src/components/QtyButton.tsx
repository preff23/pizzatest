import { useState } from 'react';

type Props = {
  itemId: string;
  onAdd: () => void;
  onRemove: () => void;
};

export default function QtyButton({ onAdd, onRemove }: Props) {
  const [count, setCount] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);

  const handleAdd = () => {
    const newCount = count + 1;
    setCount(newCount);
    onAdd();
    
    // Haptic feedback
    if ((window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred) {
      (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    
    // Pulse animation
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 120);
  };

  const handleRemove = () => {
    if (count > 0) {
      const newCount = count - 1;
      setCount(newCount);
      onRemove();
      
      // Haptic feedback
      if ((window as any).Telegram?.WebApp?.HapticFeedback?.selectionChanged) {
        (window as any).Telegram.WebApp.HapticFeedback.selectionChanged();
      }
      
      // Pulse animation
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 120);
    }
  };

  if (count === 0) {
    return (
      <button
        className="btn-add"
        aria-label="Добавить"
        onClick={handleAdd}
      >
        +
      </button>
    );
  }

  return (
    <div className="qty">
      <button 
        className="qbtn" 
        aria-label="Убавить"
        onClick={handleRemove}
      >
        –
      </button>
      <span className={`qval ${isPulsing ? 'pulse' : ''}`}>
        {count}
      </span>
      <button 
        className="qbtn" 
        aria-label="Добавить"
        onClick={handleAdd}
      >
        +
      </button>
    </div>
  );
}

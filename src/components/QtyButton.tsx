import { useState, useRef } from 'react';

type Props = {
  itemId: string;
  onAdd: () => void;
  onRemove: () => void;
};

// Функция анимации счетчика
function animateQty(el: HTMLElement) {
  el.classList.remove('tock');
  // force reflow
  void el.offsetWidth;
  el.classList.add('tock');
  setTimeout(() => el.classList.remove('tock'), 180);
}

export default function QtyButton({ onAdd, onRemove }: Props) {
  const [count, setCount] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const qtyRef = useRef<HTMLSpanElement>(null);

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
    setTimeout(() => setIsPulsing(false), 180);
    
    // Animate quantity change
    if (qtyRef.current) {
      animateQty(qtyRef.current);
    }
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
      setTimeout(() => setIsPulsing(false), 180);
      
      // Animate quantity change
      if (qtyRef.current) {
        animateQty(qtyRef.current);
      }
    }
  };

  if (count === 0) {
    return (
      <button
        className={`btn-add ${isPulsing ? 'pulse' : ''}`}
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
      <span ref={qtyRef} className="qty-num">
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

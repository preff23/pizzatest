import { useState, useEffect } from 'react';

type ToastProps = {
  message: string;
  duration?: number;
  onClose?: () => void;
};

export default function Toast({ message, duration = 1200, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show toast
    setIsVisible(true);
    
    // Hide toast after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 160); // Wait for transition to complete
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div 
      className={`toast ${isVisible ? 'show' : ''}`}
      aria-live="polite"
      role="status"
    >
      {message}
    </div>
  );
}
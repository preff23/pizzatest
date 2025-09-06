import { useState, useEffect } from 'react';

type ToastProps = {
  message: string;
  duration?: number;
  onClose?: () => void;
};

export default function Toast({ message, duration = 1200, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // Время для анимации исчезновения
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="toast">
      {message}
    </div>
  );
}
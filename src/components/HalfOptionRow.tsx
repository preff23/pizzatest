import { MenuItem } from '../types';

type Props = {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
};

export function HalfOptionRow({ item, onSelect }: Props) {
  const handleSelect = () => {
    onSelect(item);
    
    // Haptic feedback
    if ((window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred) {
      (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  return (
    <div className="halfRow">
      <div className="halfRow__text">
        <div className="halfRow__title">{item.name}</div>
        <div className="halfRow__desc">{item.desc}</div>
      </div>

      <div className="halfRow__actions">
        <div className="pricePill">{item.price.toLocaleString('ru-RU')} ₽</div>
        <button
          type="button"
          aria-label={`Добавить ${item.name} как половинку`}
          className="addCircle"
          onClick={handleSelect}
        >
          +
        </button>
      </div>
    </div>
  );
}


type Dish = {
  id: string;
  name: string;
  desc: string;
  price: number;
};

type Props = {
  dish: Dish;
  onAdd: () => void;
};

export default function DishCard({ dish, onAdd }: Props) {
  const handleAdd = () => {
    // Хаптик обратная связь
    if (window.Telegram?.WebApp?.HapticFeedback?.impactOccurred) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    
    // Bounce animation
    const button = document.querySelector('.btn-add') as HTMLElement;
    if (button) {
      button.classList.add('bounce');
      setTimeout(() => button.classList.remove('bounce'), 150);
    }
    
    onAdd();
  };

  return (
    <div className="row">
      <div>
        <h3>{dish.name}</h3>
        <p className="desc">{dish.desc}</p>
      </div>
      <div className="aside">
        <div className="price">{dish.price.toLocaleString('ru-RU')} ₽</div>
        <button 
          className="btn-add" 
          aria-label="Добавить" 
          onClick={handleAdd}
        >
          +
        </button>
      </div>
    </div>
  );
}

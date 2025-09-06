
type Dish = {
  id: string;
  name: string;
  desc: string;
  price: number;
  badges?: string[];
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
    onAdd();
  };

  return (
    <article className="card">
      <div className="card-grid">
        <div className="emoji" aria-hidden="true">
          {(dish.badges ?? ['🍕'])[0]}
        </div>
        <div>
          <h3>{dish.name}</h3>
          <p className="desc">{dish.desc}</p>
        </div>
        <div className="aside">
          <div className="price">{dish.price.toLocaleString('ru-RU')} ₽</div>
          <button 
            className="add-btn" 
            aria-label="Добавить в корзину" 
            onClick={handleAdd}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}


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
  return (
    <article className="dish">
      <div className="left">
        {(dish.badges ?? ['🍕']).slice(0, 3).map((badge, i) => (
          <div key={i} className="icon-badge" aria-hidden="true">
            {badge}
          </div>
        ))}
      </div>
      <div>
        <h3>{dish.name}</h3>
        <p className="desc">{dish.desc}</p>
      </div>
      <div>
        <div className="price">{dish.price} ₽</div>
        <button 
          className="add-btn" 
          aria-label="Добавить в корзину" 
          onClick={onAdd}
        >
          +
        </button>
      </div>
    </article>
  );
}

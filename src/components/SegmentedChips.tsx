
type Tab = {
  key: string;
  label: string;
  count?: number;
};

type Props = {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
};

export default function SegmentedChips({ tabs, active, onChange }: Props) {
  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`chip ${active === tab.key ? 'active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span className="badge">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

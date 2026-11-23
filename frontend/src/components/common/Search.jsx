import { Icon } from "./Icon";

export function Search({ value, onChange, placeholder = "Search records…" }) {
  return (
    <div className="search">
      <Icon name="search" size={16} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      {value && (
        <button onClick={() => onChange("")}>
          <Icon name="close" size={14} />
        </button>
      )}
    </div>
  );
}
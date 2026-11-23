import { Icon } from "../common";

export function QuickActions({ actions, navigate }) {
  return (
    <div className="quick-actions">
      <span>QUICK ACTIONS</span>
      {actions.map(([name, route]) => (
        <button key={name} onClick={() => navigate(route)}>
          <Icon name="plus" size={15} />
          {name}
        </button>
      ))}
    </div>
  );
}
import { Icon } from "./Icon";

export function Empty({ title, detail }) {
  return (
    <div className="empty">
      <div>
        <Icon name="file" size={26} />
      </div>
      <h3>{title}</h3>
      <p>{detail}</p>
    </div>
  );
}
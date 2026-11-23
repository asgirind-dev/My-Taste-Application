import { Icon } from "../common";

export function Timeline({ rows }) {
  return (
    <div className="timeline">
      {rows.map((r) => (
        <div key={r.id}>
          <span>
            <Icon name="check" size={14} />
          </span>
          <div>
            <b>{r.action}</b>
            <p>
              {r.user} · {r.record}
            </p>
            <small>{r.time}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
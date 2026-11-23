import { Badge } from "../common";

export function RequestList({ rows }) {
  return (
    <div>
      {rows.map((r) => (
        <div className="alert-row" key={r.id}>
          <span className="product-symbol">{r.item[0]}</span>
          <div>
            <b>{r.item}</b>
            <small>
              {r.id} · {r.dispatched} units from {r.to}
            </small>
          </div>
          <Badge>{r.status}</Badge>
        </div>
      ))}
    </div>
  );
}
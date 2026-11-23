import { Badge } from "../common";

export function InventoryTable({ state, location }) {
  const inv = state.inventory[location] || {};
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>On hand</th>
            <th>Threshold</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(inv).map(([name, qty]) => {
            const item = state.items.find((i) => i.name === name);
            const low = item && qty <= item.threshold;
            return (
              <tr key={name}>
                <td>
                  <b>{name}</b>
                  <small>{item?.code}</small>
                </td>
                <td>
                  <b>{qty.toLocaleString()}</b> {item?.unit}
                </td>
                <td>
                  {item?.threshold || "—"} {item?.threshold ? item.unit : ""}
                </td>
                <td>
                  <Badge>{low ? "Low stock" : "Healthy"}</Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
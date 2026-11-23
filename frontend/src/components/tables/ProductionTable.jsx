import { Badge } from "../common";

export function ProductionTable({ plans }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Date</th>
            <th>Product</th>
            <th>Planned</th>
            <th>Actual</th>
            <th>Progress</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((x) => (
            <tr key={x.id}>
              <td>
                <b>{x.id}</b>
              </td>
              <td>{x.date}</td>
              <td>{x.product}</td>
              <td>{x.planned}</td>
              <td>{x.actual}</td>
              <td>
                <div className="progress">
                  <i style={{ width: `${Math.min(100, (x.actual / x.planned) * 100)}%` }} />
                </div>
                <small>{Math.round((x.actual / x.planned) * 100)}%</small>
              </td>
              <td>
                <Badge>{x.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
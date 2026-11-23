import { Badge } from "../common";
import { money } from "../../utils";

export function SalesTable({ sales }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Receipt</th>
            <th>Location</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id}>
              <td>
                <b>{s.id}</b>
                <small>{s.date}</small>
              </td>
              <td>{s.location}</td>
              <td>{s.payment}</td>
              <td>
                <b>{money(s.total)}</b>
              </td>
              <td>
                <Badge>{s.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
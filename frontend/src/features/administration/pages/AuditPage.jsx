import { useState } from "react";
import { Badge, Card, PageHeader, Search } from "../../../components/common";
import { useDemo } from "../../../contexts/DemoStateContext";

export function AuditPage() {
  const { state } = useDemo();
  const [search, setSearch] = useState("");

  const rows = state.audit.filter((a) =>
    Object.values(a).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader
        eyebrow="SYSTEM ADMINISTRATION"
        title="Audit logs"
        description="Trace significant user actions and affected operational records."
      />
      <Card>
        <div className="table-tools">
          <Search
            value={search}
            onChange={setSearch}
            placeholder="Search action, user, or record…"
          />
          <select>
            <option>All results</option>
            <option>Success</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Role</th>
                <th>Location</th>
                <th>Action</th>
                <th>Affected record</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.id}>
                  <td>{x.time}</td>
                  <td><b>{x.user}</b></td>
                  <td>{x.role}</td>
                  <td>{x.location}</td>
                  <td>{x.action}</td>
                  <td>{x.record}</td>
                  <td><Badge>{x.result}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
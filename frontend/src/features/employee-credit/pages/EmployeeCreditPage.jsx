import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Icon,
  PageHeader,
  Search,
} from "../../../components/common";
import { EmployeeModal } from "../../../components/forms";
import { useDemo } from "../../../contexts/DemoStateContext";
import { money } from "../../../utils";

export function EmployeeCreditPage() {
  const { state, setState, notify } = useDemo();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [tab, setTab] = useState("Employees");
  const [positions, setPositions] = useState([
    { name: "Team Leader", limit: 18000 },
    { name: "Technician", limit: 15000 },
    { name: "Machine Operator", limit: 12000 },
    { name: "Trainee", limit: 0 },
  ]);

  const employees = state.employees.filter((e) =>
    `${e.id} ${e.name} ${e.position}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader
        eyebrow="EMPLOYEE CANTEEN CREDIT"
        title="Credit administration"
        description="Manage eligible employees, position limits, monthly allocations, and preferences."
        actions={
          <Button onClick={() => setModal(true)}>
            <Icon name="plus" /> Add employee
          </Button>
        }
      />
      <div className="tabs">
        <button
          className={tab === "Employees" ? "active" : ""}
          onClick={() => setTab("Employees")}
        >
          Employee directory
        </button>
        <button
          className={tab === "Positions" ? "active" : ""}
          onClick={() => setTab("Positions")}
        >
          Job positions
        </button>
        <button
          className={tab === "Periods" ? "active" : ""}
          onClick={() => setTab("Periods")}
        >
          Monthly periods
        </button>
      </div>

      {tab === "Employees" && (
        <Card>
          <div className="table-tools">
            <Search value={search} onChange={setSearch} placeholder="Search employees…" />
            <Badge>March 2026 · Open</Badge>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Position</th>
                  <th>Eligibility</th>
                  <th>Email preference</th>
                  <th>Status</th>
                  <th>Available credit</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <b>{e.name}</b>
                      <small>
                        {e.id} · {e.email}
                      </small>
                    </td>
                    <td>{e.position}</td>
                    <td>
                      <Badge>{e.eligible ? "Eligible" : "Not eligible"}</Badge>
                    </td>
                    <td>{e.optIn ? "Purchase emails on" : "No emails"}</td>
                    <td>
                      <Badge>{e.active ? "Active" : "Inactive"}</Badge>
                    </td>
                    <td>
                      <b>{money(e.balance)}</b>
                    </td>
                    <td>
                      <button
                        className="table-action"
                        onClick={() => {
                          setState((s) => ({
                            ...s,
                            employees: s.employees.map((x) =>
                              x.id === e.id ? { ...x, eligible: !x.eligible } : x
                            ),
                          }));
                          notify("Employee eligibility updated");
                        }}
                      >
                        Toggle eligibility
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "Positions" && (
        <Card
          title="Demonstration monthly limits"
          subtitle="Illustrative values for prototype review only"
        >
          <div className="position-grid">
            {positions.map((x, i) => (
              <div key={x.name}>
                <span>{x.name[0]}</span>
                <div>
                  <b>{x.name}</b>
                  <small>Monthly employee credit</small>
                </div>
                <input
                  type="number"
                  value={x.limit}
                  onChange={(e) =>
                    setPositions(
                      positions.map((p, n) =>
                        n === i ? { ...p, limit: Number(e.target.value) } : p
                      )
                    )
                  }
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Periods" && (
        <Card title="Monthly credit periods">
          <div className="period-card">
            <div className="calendar-block">
              <b>MAR</b>
              <span>2026</span>
            </div>
            <div>
              <h3>March 2026</h3>
              <p>Allocated to 3 eligible employees · No carry-forward</p>
            </div>
            <div>
              <span>Allocated</span>
              <b>{money(45000)}</b>
            </div>
            <div>
              <span>Used</span>
              <b>{money(state.ledger.reduce((a, x) => a + x.debit, 0))}</b>
            </div>
            <Badge>Open</Badge>
            <Button
              variant="secondary"
              onClick={() =>
                notify("Closing is blocked while demonstration transactions are pending")
              }
            >
              Close period
            </Button>
          </div>
        </Card>
      )}

      {modal && (
        <EmployeeModal
          state={state}
          close={() => setModal(false)}
          save={(e) => {
            setState((s) => ({ ...s, employees: [...s.employees, e] }));
            setModal(false);
            notify("Employee profile created");
          }}
        />
      )}
    </>
  );
}
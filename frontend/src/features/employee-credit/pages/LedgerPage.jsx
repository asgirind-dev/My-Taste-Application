import {
  Badge,
  Button,
  Card,
  Field,
  Icon,
  PageHeader,
} from "../../../components/common";
import { useDemo } from "../../../contexts/DemoStateContext";
import { money } from "../../../utils";

export function LedgerPage() {
  const { state, notify } = useDemo();

  const exportCsv = () => {
    const csv = [
      "Employee ID,Date,Type,Sale,Debit,Credit,Balance",
      ...state.ledger.map((x) =>
        [x.employeeId, x.date, x.type, x.saleRef, x.debit, x.credit, x.balance].join(",")
      ),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv]));
    a.download = "credit-payroll-reconciliation.csv";
    a.click();
    notify("Payroll reconciliation CSV exported");
  };

  return (
    <>
      <PageHeader
        eyebrow="EXTERNAL RECONCILIATION"
        title="Credit transactions"
        description="Review allocation usage and export a ledger for external payroll reconciliation."
        actions={<Button onClick={exportCsv}>Export CSV</Button>}
      />
      <div className="rule-banner">
        <Icon name="credit" />
        <div>
          <b>Reconciliation only</b>
          <span>
            This export supports external review. MY TASTE does not calculate payroll or process
            salary deductions.
          </span>
        </div>
      </div>
      <Card>
        <div className="filter-bar">
          <Field label="Credit period">
            <select>
              <option>March 2026</option>
            </select>
          </Field>
          <Field label="Employee">
            <select>
              <option>All employees</option>
              {state.employees.map((e) => (
                <option key={e.id}>{e.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Position">
            <select>
              <option>All positions</option>
              <option>Machine Operator</option>
              <option>Team Leader</option>
            </select>
          </Field>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Type</th>
                <th>Sale reference</th>
                <th>Debit</th>
                <th>Credit restoration</th>
                <th>Remaining balance</th>
              </tr>
            </thead>
            <tbody>
              {state.ledger.map((x) => {
                const e = state.employees.find((e) => e.id === x.employeeId);
                return (
                  <tr key={x.id}>
                    <td>
                      <b>{e?.name}</b>
                      <small>
                        {x.employeeId} · {e?.position}
                      </small>
                    </td>
                    <td>{x.date}</td>
                    <td>
                      <Badge>{x.type}</Badge>
                    </td>
                    <td>{x.saleRef}</td>
                    <td>{x.debit ? money(x.debit) : "—"}</td>
                    <td>{x.credit ? money(x.credit) : "—"}</td>
                    <td>
                      <b>{money(x.balance)}</b>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
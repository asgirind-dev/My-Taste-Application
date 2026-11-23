import { useState } from "react";
import {
  Button,
  Card,
  Field,
  PageHeader,
  StatCard,
} from "../../../components/common";
import { SalesTable } from "../../../components/tables";
import { useDemo } from "../../../contexts/DemoStateContext";
import { locations, money } from "../../../utils";

export function ReportsPage() {
  const { state, notify } = useDemo();
  const [category, setCategory] = useState("Branch Sales");
  
  const categories = [
    "Procurement",
    "Supplier Payments",
    "Central Inventory",
    "Stock Movements",
    "Bakery Production",
    "Stock Distribution",
    "Branch Sales",
    "Bakery Wastage",
    "Employee Credit Usage",
  ];

  const exportCsv = () => {
    const rows = state.sales.map((s) => [s.id, s.date, s.location, s.payment, s.total, s.status]);
    const csv = [["Reference", "Date", "Location", "Payment", "Total LKR", "Status"], ...rows]
      .map((r) => r.join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "my-taste-report.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    notify("CSV report exported");
  };

  const total = state.sales
    .filter((s) => s.status === "Completed")
    .reduce((a, s) => a + s.total, 0);

  return (
    <>
      <PageHeader
        eyebrow="REPORTING & ANALYTICS"
        title="Operational reports"
        description="Explore role-appropriate summaries and export consistent demonstration records."
        actions={
          <>
            <Button variant="secondary" onClick={() => window.print()}>
              Print view
            </Button>
            <Button onClick={exportCsv}>Export CSV</Button>
          </>
        }
      />
      <div className="report-tabs">
        {categories.map((x) => (
          <button
            key={x}
            className={category === x ? "active" : ""}
            onClick={() => setCategory(x)}
          >
            {x}
          </button>
        ))}
      </div>
      <Card>
        <div className="filter-bar">
          <Field label="From date">
            <input type="date" defaultValue="2026-03-01" />
          </Field>
          <Field label="To date">
            <input type="date" defaultValue="2026-03-31" />
          </Field>
          <Field label="Location">
            <select>
              <option>All authorized locations</option>
              {locations.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select>
              <option>All statuses</option>
              <option>Completed</option>
              <option>Pending</option>
            </select>
          </Field>
          <Button>Apply filters</Button>
        </div>
      </Card>
      <div className="stats four">
        <StatCard label="Report category" value={category} detail="March 2026" icon="report" />
        <StatCard
          label="Net sales"
          value={money(total)}
          detail="Completed transactions"
          tone="green"
        />
        <StatCard
          label="Transactions"
          value={state.sales.length}
          detail="All payment types"
          tone="blue"
          icon="cart"
        />
        <StatCard
          label="Void value"
          value={money(
            state.sales.filter((s) => s.status === "VOIDED").reduce((a, s) => a + s.total, 0)
          )}
          detail="Preserved separately"
          tone="orange"
          icon="file"
        />
      </div>
      <div className="grid-main report-grid">
        <Card title="Sales by location" subtitle="Completed gross value (LKR)">
          <div className="bar-chart">
            {locations.slice(2).map((l) => {
              const v = state.sales
                .filter((s) => s.location === l && s.status === "Completed")
                .reduce((a, s) => a + s.total, 0);
              return (
                <div key={l}>
                  <span>{l.replace(" Restaurant", "")}</span>
                  <i>
                    <b style={{ width: `${Math.max(8, total ? (v / total) * 100 : 0)}%` }} />
                  </i>
                  <strong>{money(v)}</strong>
                </div>
              );
            })}
          </div>
        </Card>
        <Card title="Recent transactions" subtitle="Source records for this report">
          <SalesTable sales={state.sales} />
        </Card>
      </div>
    </>
  );
}
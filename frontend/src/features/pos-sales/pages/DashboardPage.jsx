import {
  Button,
  Card,
  DashboardIntro,
  Icon,
  StatCard,
} from "../../../components/common";
import { SalesTable } from "../../../components/tables";
import { useDemo } from "../../../contexts/DemoStateContext";
import { money } from "../../../utils";

export function CashierDashboardPage() {
  const { state, location, navigate } = useDemo();
  const mine = state.sales.filter((s) => s.cashier === "Kavindi Silva");

  return (
    <>
      <DashboardIntro
        role="Cashier"
        title="Ready for service"
        text={`Open a till at ${location} and process customer sales.`}
      />
      <div className="stats four">
        <StatCard label="My sales today" value={mine.length} detail="Completed receipts" icon="cart" />
        <StatCard
          label="Sales value"
          value={money(mine.reduce((a, s) => a + s.total, 0))}
          detail="Gross total"
          tone="green"
          icon="report"
        />
        <StatCard
          label="Credit sales"
          value={mine.filter((s) => s.payment === "Employee Credit").length}
          detail="Canteen transactions"
          icon="credit"
          tone="blue"
        />
        <StatCard
          label="Void requests"
          value={
            state.voids.filter(
              (v) => v.requestedBy === "Kavindi Silva" && v.status === "Pending"
            ).length
          }
          detail="Awaiting manager"
          icon="file"
          tone="orange"
        />
      </div>
      <div className="grid-main">
        <Card title="Recent receipts" subtitle="Your latest completed transactions">
          <SalesTable sales={mine} />
        </Card>
        <Card title="Quick start" subtitle="Common till actions">
          <div className="action-stack">
            <button onClick={() => navigate("/pos")}>
              <span>
                <Icon name="cart" />
              </span>
              <div>
                <b>Start a new sale</b>
                <small>Search products and take payment</small>
              </div>
              <Icon name="arrow" />
            </button>
            <button onClick={() => navigate("/voids")}>
              <span>
                <Icon name="file" />
              </span>
              <div>
                <b>Request billing void</b>
                <small>Find an existing receipt</small>
              </div>
              <Icon name="arrow" />
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}
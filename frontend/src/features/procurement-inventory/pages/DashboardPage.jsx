import {
  Badge,
  Card,
  DashboardIntro,
  Empty,
  StatCard,
} from "../../../components/common";
import { InventoryTable, QuickActions } from "../../../components/tables";
import { useDemo } from "../../../contexts/DemoStateContext";
import { money } from "../../../utils";

export function StockDashboardPage() {
  const { state, navigate } = useDemo();
  const inv = state.inventory["Central Warehouse"];
  const lows = state.items.filter(
    (i) => i.type === "Raw material" && (inv[i.name] || 0) <= i.threshold
  );

  return (
    <>
      <DashboardIntro
        role="Central warehouse"
        title="Warehouse operations"
        text="Monitor purchasing, receiving, central stock, and supplier obligations."
      />
      <div className="stats six">
        <StatCard label="Inventory items" value="8" detail="Raw materials" icon="box" />
        <StatCard
          label="Low-stock warnings"
          value={lows.length}
          detail="Needs attention"
          tone="orange"
          icon="bell"
        />
        <StatCard
          label="Pending purchases"
          value={state.purchases.filter((x) => x.status !== "Received").length}
          detail="Open orders"
          icon="cart"
          tone="blue"
        />
        <StatCard
          label="Awaiting receipts"
          value={state.purchases.filter((x) => x.status === "Awaiting receipt").length}
          detail="Physical check due"
          icon="truck"
        />
        <StatCard
          label="Outstanding"
          value={money(state.invoices.reduce((a, x) => a + x.total - x.paid, 0))}
          detail="Supplier invoices"
          icon="credit"
          tone="orange"
        />
        <StatCard
          label="Stock requests"
          value={
            state.requests.filter((r) => r.to === "Central Warehouse" && r.status === "Pending")
              .length
          }
          detail="Incoming"
          icon="bell"
          tone="green"
        />
      </div>
      <QuickActions
        actions={[
          ["Add supplier", "/suppliers"],
          ["Add item", "/suppliers"],
          ["Create purchase", "/purchases"],
          ["Receive goods", "/purchases"],
          ["Record payment", "/invoices"],
          ["Adjust stock", "/reports"],
        ]}
        navigate={navigate}
      />
      <div className="grid-main">
        <Card
          title="Central inventory"
          subtitle="Current on-hand quantity and reorder position"
          action={
            <button className="link" onClick={() => navigate("/reports")}>
              Full report
            </button>
          }
        >
          <InventoryTable state={state} location="Central Warehouse" />
        </Card>
        <Card title="Low-stock alerts" subtitle="At or below reorder threshold">
          {lows.length ? (
            lows.map((i) => (
              <div className="alert-row" key={i.code}>
                <span className="product-symbol">{i.name[0]}</span>
                <div>
                  <b>{i.name}</b>
                  <small>
                    {inv[i.name]} {i.unit} on hand
                  </small>
                </div>
                <Badge>Low stock</Badge>
              </div>
            ))
          ) : (
            <Empty title="Stock levels healthy" detail="No raw material is below threshold." />
          )}
        </Card>
      </div>
    </>
  );
}
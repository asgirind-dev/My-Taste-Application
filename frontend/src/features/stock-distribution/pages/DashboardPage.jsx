import {
  Button,
  Card,
  DashboardIntro,
  Empty,
  Icon,
  StatCard,
} from "../../../components/common";
import { InventoryTable, RequestList } from "../../../components/tables";
import { useDemo } from "../../../contexts/DemoStateContext";
import { money } from "../../../utils";

export function BranchDashboardPage() {
  const { state, location, navigate } = useDemo();
  const sales = state.sales.filter((s) => s.location === location && s.status === "Completed");

  return (
    <>
      <DashboardIntro
        role="Branch manager"
        title={location === "All locations" ? "Downtown Restaurant" : location}
        text="Monitor branch stock, deliveries, sales, discrepancies, and billing corrections."
      />
      <div className="stats five">
        <StatCard
          label="Daily net sales"
          value={money(sales.reduce((a, s) => a + s.total, 0))}
          detail={`${sales.length} completed sales`}
          tone="green"
          icon="report"
        />
        <StatCard
          label="Pending deliveries"
          value={
            state.requests.filter(
              (r) => r.from === location && ["Approved", "Dispatched"].includes(r.status)
            ).length
          }
          detail="Expected today"
          icon="truck"
          tone="blue"
        />
        <StatCard
          label="Low stock"
          value={Object.values(state.inventory[location] || {}).filter((n) => n < 15).length}
          detail="Tracked products"
          tone="orange"
          icon="box"
        />
        <StatCard
          label="Void requests"
          value={state.voids.filter((v) => v.status === "Pending").length}
          detail="Awaiting decision"
          icon="file"
        />
        <StatCard
          label="Discrepancies"
          value="1"
          detail="This week"
          icon="bell"
          tone="orange"
        />
      </div>
      <div className="grid-main">
        <Card title="Branch stock overview" subtitle={`Tracked inventory at ${location}`}>
          <InventoryTable state={state} location={location} />
        </Card>
        <Card title="Incoming deliveries" subtitle="Transfers awaiting receipt">
          {state.requests.filter((r) => r.from === location && r.status === "Dispatched")
            .length ? (
            <RequestList
              rows={state.requests.filter(
                (r) => r.from === location && r.status === "Dispatched"
              )}
            />
          ) : (
            <Empty
              title="No arrivals waiting"
              detail="Dispatched transfers will appear here for receipt."
            />
          )}
        </Card>
      </div>
    </>
  );
}
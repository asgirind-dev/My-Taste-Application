import {
  Button,
  Card,
  DashboardIntro,
  StatCard,
} from "../../../components/common";
import { InventoryTable, ProductionTable } from "../../../components/tables";
import { useDemo } from "../../../contexts/DemoStateContext";

export function BakeryDashboardPage() {
  const { state, navigate } = useDemo();
  const planned = state.plans.reduce((a, x) => a + x.planned, 0);
  const actual = state.plans.reduce((a, x) => a + x.actual, 0);

  return (
    <>
      <DashboardIntro
        role="Main bakery"
        title="Today's bakery floor"
        text="Plan production, request ingredients, and post completed bakery batches."
      />
      <div className="stats five">
        <StatCard
          label="Production target"
          value={`${planned} pcs`}
          detail="Across 2 products"
          icon="store"
        />
        <StatCard
          label="Completed"
          value={`${actual} pcs`}
          detail="Posted and in progress"
          tone="green"
          icon="check"
        />
        <StatCard
          label="Progress"
          value={`${Math.round((actual / planned) * 100)}%`}
          detail="Today's plan"
          icon="report"
          tone="blue"
        />
        <StatCard
          label="Ingredient requests"
          value={
            state.requests.filter((r) => r.from === "Main Bakery" && r.status === "Pending").length
          }
          detail="Awaiting warehouse"
          icon="truck"
          tone="orange"
        />
        <StatCard
          label="Finished stock"
          value={Object.values(state.inventory["Main Bakery"]).reduce((a, b) => a + b, 0)}
          detail="Saleable units"
          icon="box"
        />
      </div>
      <div className="grid-main">
        <Card
          title="Daily production plan"
          subtitle="Friday, 06 March 2026"
          action={<Button onClick={() => navigate("/production")}>Manage production</Button>}
        >
          <ProductionTable plans={state.plans} />
        </Card>
        <Card title="Finished product inventory" subtitle="Available at Main Bakery">
          <InventoryTable state={state} location="Main Bakery" />
        </Card>
      </div>
    </>
  );
}
import { useState } from "react";
import {
  Button,
  Card,
  Field,
  Icon,
  Modal,
  ModalActions,
  PageHeader,
} from "../../../components/common";
import { ProductionTable } from "../../../components/tables";
import { useDemo } from "../../../contexts/DemoStateContext";
import { today } from "../../../utils";

export function BakeryProductionPage() {
  const { state, setState, notify } = useDemo();
  const [modal, setModal] = useState(null);
  const products = state.items.filter((i) => i.type === "Bakery product");
  const [product, setProduct] = useState(products[0]?.name || "");
  const [qty, setQty] = useState("100");
  const [planId, setPlanId] = useState(state.plans.find((x) => !x.posted)?.id || "");

  const addPlan = () => {
    if (Number(qty) <= 0) return notify("Planned quantity must be greater than zero");
    setState((s) => ({
      ...s,
      plans: [
        ...s.plans,
        {
          id: `PLN-2026-${String(s.plans.length + 8).padStart(4, "0")}`,
          date: today(),
          product,
          planned: Number(qty),
          actual: 0,
          status: "Not Started",
          posted: false,
        },
      ],
    }));
    setModal(null);
    notify("Production plan added");
  };

  const batch = () => {
    const plan = state.plans.find((x) => x.id === planId);
    if (!plan || plan.posted) return notify("This batch was already posted");
    const made = Number(qty);
    if (made <= 0) return notify("Enter a produced quantity");
    setState((s) => ({
      ...s,
      plans: s.plans.map((x) =>
        x.id === plan.id
          ? {
              ...x,
              actual: x.actual + made,
              status: x.actual + made >= x.planned ? "Completed" : "In Progress",
              posted: true,
            }
          : x
      ),
      inventory: {
        ...s.inventory,
        "Main Bakery": {
          ...s.inventory["Main Bakery"],
          [plan.product]: (s.inventory["Main Bakery"][plan.product] || 0) + made,
        },
      },
    }));
    setModal(null);
    notify(`${made} ${plan.product} added to bakery finished stock`);
  };

  const ingredient = () => {
    setState((s) => ({
      ...s,
      requests: [
        ...s.requests,
        {
          id: `REQ-2026-${String(s.requests.length + 1).padStart(4, "0")}`,
          from: "Main Bakery",
          to: "Central Warehouse",
          item: product,
          requested: Number(qty),
          approved: 0,
          dispatched: 0,
          received: 0,
          date: today(),
          status: "Pending",
        },
      ],
    }));
    setModal(null);
    notify("Ingredient request sent to Central Warehouse");
  };

  return (
    <>
      <PageHeader
        eyebrow="BAKERY PRODUCTION"
        title="Daily planning & production"
        description="Plan finished products, request ingredients, and confirm physical output."
        actions={
          <>
            <Button variant="secondary" onClick={() => setModal("ingredient")}>
              Request ingredients
            </Button>
            <Button variant="secondary" onClick={() => setModal("batch")}>
              Confirm batch
            </Button>
            <Button onClick={() => setModal("plan")}>
              <Icon name="plus" /> Create plan
            </Button>
          </>
        }
      />
      <div className="rule-banner">
        <Icon name="store" />
        <div>
          <b>Production posting rule</b>
          <span>
            Confirmed output increases bakery finished stock. Recipe-based ingredient deduction is
            not included.
          </span>
        </div>
      </div>
      <Card title="Daily production plans">
        <ProductionTable plans={state.plans} />
      </Card>
      {modal && (
        <Modal
          title={
            modal === "plan"
              ? "Create production plan"
              : modal === "batch"
              ? "Confirm completed production"
              : "Request ingredients"
          }
          description={
            modal === "batch"
              ? "Verification prevents duplicate posting."
              : "Enter the required product and quantity."
          }
          onClose={() => setModal(null)}
        >
          {modal === "batch" ? (
            <Field label="Production plan">
              <select value={planId} onChange={(e) => setPlanId(e.target.value)}>
                {state.plans
                  .filter((x) => !x.posted)
                  .map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.id} · {x.product}
                    </option>
                  ))}
              </select>
            </Field>
          ) : (
            <Field label={modal === "ingredient" ? "Raw material" : "Bakery product"}>
              <select value={product} onChange={(e) => setProduct(e.target.value)}>
                {state.items
                  .filter((i) =>
                    modal === "ingredient"
                      ? i.type === "Raw material"
                      : i.type === "Bakery product"
                  )
                  .map((x) => (
                    <option key={x.name}>{x.name}</option>
                  ))}
              </select>
            </Field>
          )}
          <Field label={modal === "batch" ? "Produced quantity" : "Quantity"}>
            <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
          </Field>
          {modal === "batch" && (
            <label className="checkbox confirm-check">
              <input type="checkbox" defaultChecked /> I verified the completed, saleable quantity.
            </label>
          )}
          <ModalActions
            close={() => setModal(null)}
            submit={modal === "plan" ? addPlan : modal === "batch" ? batch : ingredient}
            label={modal === "batch" ? "Post production" : "Submit"}
          />
        </Modal>
      )}
    </>
  );
}
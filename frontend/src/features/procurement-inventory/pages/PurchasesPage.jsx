import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Field,
  Icon,
  Modal,
  ModalActions,
  PageHeader,
} from "../../../components/common";
import { useDemo } from "../../../contexts/DemoStateContext";
import { money, today } from "../../../utils";

export function PurchasesPage() {
  const { state, setState, notify } = useDemo();
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(
    state.purchases.find((x) => x.status !== "Received")?.id || ""
  );
  const [form, setForm] = useState({
    supplier: state.suppliers[0]?.name || "",
    item: "Wheat flour",
    qty: "100",
    cost: "210",
  });

  const create = () => {
    const qty = Number(form.qty);
    const cost = Number(form.cost);
    if (qty <= 0 || cost <= 0) return notify("Enter valid quantity and unit cost");
    setState((s) => ({
      ...s,
      purchases: [
        ...s.purchases,
        {
          id: `PO-2026-${String(s.purchases.length + 1).padStart(4, "0")}`,
          supplier: form.supplier,
          date: today(),
          item: form.item,
          qty,
          unitCost: cost,
          status: "Awaiting receipt",
          received: 0,
        },
      ],
    }));
    setModal(null);
    notify("Purchase order created — inventory was not changed");
  };

  const receive = () => {
    const po = state.purchases.find((x) => x.id === selected);
    if (!po || po.status === "Received")
      return notify("This purchase has already been fully received");
    const remaining = po.qty - po.received;
    setState((s) => ({
      ...s,
      purchases: s.purchases.map((x) =>
        x.id === po.id ? { ...x, received: x.qty, status: "Received" } : x
      ),
      inventory: {
        ...s.inventory,
        "Central Warehouse": {
          ...s.inventory["Central Warehouse"],
          [po.item]: (s.inventory["Central Warehouse"][po.item] || 0) + remaining,
        },
      },
      audit: [
        {
          id: `AUD-${Date.now()}`,
          time: new Date().toLocaleString(),
          user: "Ruwan Perera",
          role: "Stock Keeper",
          location: "Central Warehouse",
          action: "Confirmed goods receipt",
          record: `GR-2026-${String(s.audit.length + 1).padStart(4, "0")}`,
          result: "Success",
        },
        ...s.audit,
      ],
    }));
    setModal(null);
    notify(`${remaining} units received; central inventory and movement history updated`);
  };

  return (
    <>
      <PageHeader
        eyebrow="PROCUREMENT"
        title="Purchase orders & goods receipts"
        description="A purchase only changes stock after physical receipt is confirmed."
        actions={
          <>
            <Button variant="secondary" onClick={() => setModal("receive")}>
              <Icon name="truck" /> Receive goods
            </Button>
            <Button onClick={() => setModal("create")}>
              <Icon name="plus" /> Create purchase order
            </Button>
          </>
        }
      />
      <div className="rule-banner">
        <Icon name="box" />
        <div>
          <b>Inventory control rule</b>
          <span>
            Drafting or approving a purchase order does not increase stock. Only a confirmed goods
            receipt posts inventory.
          </span>
        </div>
      </div>
      <Card title="Purchase orders" subtitle={`${state.purchases.length} purchase records`}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Purchase order</th>
                <th>Supplier</th>
                <th>Purchase date</th>
                <th>Item / quantity</th>
                <th>Unit cost</th>
                <th>Total</th>
                <th>Receipt status</th>
              </tr>
            </thead>
            <tbody>
              {state.purchases.map((po) => (
                <tr key={po.id}>
                  <td>
                    <b>{po.id}</b>
                  </td>
                  <td>{po.supplier}</td>
                  <td>{po.date}</td>
                  <td>
                    {po.item}
                    <small>
                      {po.received} of {po.qty} received
                    </small>
                  </td>
                  <td>{money(po.unitCost)}</td>
                  <td>
                    <b>{money(po.qty * po.unitCost)}</b>
                  </td>
                  <td>
                    <Badge>{po.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {modal === "create" && (
        <Modal
          title="Create purchase order"
          description="Add one line item for this prototype purchase."
          onClose={() => setModal(null)}
        >
          <div className="form-grid">
            <Field label="Supplier">
              <select
                value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              >
                {state.suppliers
                  .filter((x) => x.active)
                  .map((x) => (
                    <option key={x.name}>{x.name}</option>
                  ))}
              </select>
            </Field>
            <Field label="Item">
              <select
                value={form.item}
                onChange={(e) => setForm({ ...form, item: e.target.value })}
              >
                {state.items
                  .filter((x) => x.type === "Raw material")
                  .map((x) => (
                    <option key={x.name}>{x.name}</option>
                  ))}
              </select>
            </Field>
            <Field label="Quantity">
              <input
                type="number"
                value={form.qty}
                onChange={(e) => setForm({ ...form, qty: e.target.value })}
              />
            </Field>
            <Field label="Unit cost (LKR)">
              <input
                type="number"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
              />
            </Field>
          </div>
          <div className="total-bar">
            <span>Purchase total</span>
            <b>{money(Number(form.qty) * Number(form.cost))}</b>
          </div>
          <ModalActions
            close={() => setModal(null)}
            submit={create}
            label="Create purchase order"
          />
        </Modal>
      )}
      {modal === "receive" && (
        <Modal
          title="Confirm goods receipt"
          description="Verify physical quantities before posting stock."
          onClose={() => setModal(null)}
        >
          <Field label="Purchase order">
            <select value={selected} onChange={(e) => setSelected(e.target.value)}>
              {state.purchases
                .filter((x) => x.status !== "Received")
                .map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.id} · {x.item}
                  </option>
                ))}
            </select>
          </Field>
          {(() => {
            const po = state.purchases.find((x) => x.id === selected);
            return (
              po && (
                <div className="receipt-check">
                  <div>
                    <span>Ordered</span>
                    <b>{po.qty}</b>
                  </div>
                  <div>
                    <span>Previously received</span>
                    <b>{po.received}</b>
                  </div>
                  <div>
                    <span>Receive now</span>
                    <b>{po.qty - po.received}</b>
                  </div>
                </div>
              )
            );
          })()}
          <label className="checkbox confirm-check">
            <input type="checkbox" required defaultChecked /> Physical condition and quantity have
            been verified by the stock keeper.
          </label>
          <ModalActions
            close={() => setModal(null)}
            submit={receive}
            label="Confirm goods receipt"
          />
        </Modal>
      )}
    </>
  );
}
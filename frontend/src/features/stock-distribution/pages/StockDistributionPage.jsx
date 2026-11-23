import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Empty,
  Field,
  Icon,
  Modal,
  ModalActions,
  PageHeader,
} from "../../../components/common";
import { useDemo } from "../../../contexts/DemoStateContext";
import { locations, today } from "../../../utils";

export function StockDistributionPage() {
  const { state, setState, location, notify } = useDemo();
  const [tab, setTab] = useState("All requests");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    from: location === "All locations" ? "Downtown Restaurant" : location,
    item: "Classic bread loaf",
    qty: "20",
  });

  const create = () => {
    const item = state.items.find((i) => i.name === form.item);
    const to = item?.type === "Raw material" ? "Central Warehouse" : "Main Bakery";
    setState((s) => ({
      ...s,
      requests: [
        ...s.requests,
        {
          id: `REQ-2026-${String(s.requests.length + 1).padStart(4, "0")}`,
          from: form.from,
          to,
          item: form.item,
          requested: Number(form.qty),
          approved: 0,
          dispatched: 0,
          received: 0,
          date: today(),
          status: "Pending",
        },
      ],
    }));
    setModal(false);
    notify(`Stock request routed to ${to}`);
  };

  const advance = (r, action) => {
    if (action === "approve") {
      const available = state.inventory[r.to]?.[r.item] || 0;
      const n = Math.min(r.requested, available);
      if (!n) return notify("No source stock is available to approve");
      setState((s) => ({
        ...s,
        requests: s.requests.map((x) =>
          x.id === r.id
            ? { ...x, approved: n, status: n < r.requested ? "Partially approved" : "Approved" }
            : x
        ),
      }));
      notify(`${n} of ${r.requested} approved`);
    } else if (action === "dispatch") {
      const available = state.inventory[r.to]?.[r.item] || 0;
      if (available < r.approved) return notify("Source stock is now insufficient");
      setState((s) => ({
        ...s,
        requests: s.requests.map((x) =>
          x.id === r.id ? { ...x, dispatched: x.approved, status: "Dispatched" } : x
        ),
        inventory: {
          ...s.inventory,
          [r.to]: { ...s.inventory[r.to], [r.item]: available - r.approved },
        },
      }));
      notify("Transfer dispatched; source stock deducted");
    } else if (action === "receive") {
      setState((s) => ({
        ...s,
        requests: s.requests.map((x) =>
          x.id === r.id ? { ...x, received: x.dispatched, status: "Received" } : x
        ),
        inventory: {
          ...s.inventory,
          [r.from]: {
            ...s.inventory[r.from],
            [r.item]: (s.inventory[r.from]?.[r.item] || 0) + r.dispatched,
          },
        },
      }));
      notify("Receipt confirmed; destination stock increased");
    }
  };

  const tabs = [
    "All requests",
    "Incoming",
    "Approved",
    "Dispatches",
    "Receipts",
    "Discrepancies",
    "Wastage",
  ];
  const rows = state.requests.filter(
    (r) =>
      tab === "All requests" ||
      (tab === "Incoming" && r.status === "Pending") ||
      (tab === "Approved" && r.status.includes("approved")) ||
      (tab === "Dispatches" && r.status === "Dispatched") ||
      (tab === "Receipts" && r.status === "Received")
  );

  return (
    <>
      <PageHeader
        eyebrow="STOCK DISTRIBUTION"
        title="Requests & transfers"
        description="Trace stock from request through approval, dispatch, and destination receipt."
        actions={
          <Button onClick={() => setModal(true)}>
            <Icon name="plus" /> Request stock
          </Button>
        }
      />
      <div className="workflow-strip">
        {["Request", "Approve", "Dispatch", "Receive"].map((x, i) => (
          <div key={x}>
            <span>{i + 1}</span>
            <b>{x}</b>
            {i < 3 && <i />}
          </div>
        ))}
      </div>
      <div className="tabs scroll">
        {tabs.map((x) => (
          <button key={x} className={tab === x ? "active" : ""} onClick={() => setTab(x)}>
            {x}
          </button>
        ))}
      </div>
      <Card>
        {["Discrepancies", "Wastage"].includes(tab) ? (
          <Empty
            title={tab === "Wastage" ? "No wastage records today" : "No open discrepancies"}
            detail={
              tab === "Wastage"
                ? "Damaged or unsold bakery products can be recorded here."
                : "Receipt quantity issues will remain visible here."
            }
          />
        ) : rows.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Route</th>
                  <th>Item</th>
                  <th>Requested</th>
                  <th>Approved</th>
                  <th>Dispatched / received</th>
                  <th>Status</th>
                  <th>Next action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <b>{r.id}</b>
                      <small>{r.date}</small>
                    </td>
                    <td>
                      {r.from}
                      <small>from {r.to}</small>
                    </td>
                    <td>{r.item}</td>
                    <td>{r.requested}</td>
                    <td>{r.approved || "—"}</td>
                    <td>
                      {r.dispatched || "—"} / {r.received || "—"}
                    </td>
                    <td>
                      <Badge>{r.status}</Badge>
                    </td>
                    <td>
                      {r.status === "Pending" ? (
                        <button className="table-action" onClick={() => advance(r, "approve")}>
                          Review & approve
                        </button>
                      ) : r.status.includes("approved") || r.status === "Approved" ? (
                        <button className="table-action" onClick={() => advance(r, "dispatch")}>
                          Dispatch
                        </button>
                      ) : r.status === "Dispatched" ? (
                        <button className="table-action" onClick={() => advance(r, "receive")}>
                          Confirm receipt
                        </button>
                      ) : (
                        <span className="muted">Complete</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            title="No matching transfers"
            detail="Try another workflow tab or create a stock request."
          />
        )}
      </Card>
      {modal && (
        <Modal
          title="Request stock"
          description="The supplying location is assigned automatically by item type."
          onClose={() => setModal(false)}
        >
          <Field label="Requesting location">
            <select value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })}>
              {locations.slice(1).map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
          <Field label="Item">
            <select value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })}>
              {state.items
                .filter((i) => i.active && ["Raw material", "Bakery product"].includes(i.type))
                .map((i) => (
                  <option key={i.name}>{i.name}</option>
                ))}
            </select>
          </Field>
          <Field label="Requested quantity">
            <input
              type="number"
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: e.target.value })}
            />
          </Field>
          <Field label="Required date">
            <input type="date" defaultValue={today()} />
          </Field>
          <ModalActions close={() => setModal(false)} submit={create} label="Submit request" />
        </Modal>
      )}
    </>
  );
}
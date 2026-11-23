import { useState } from "react";
import {
  Button,
  Empty,
  Field,
  Icon,
  Search,
} from "../../../components/common";
import { useDemo } from "../../../contexts/DemoStateContext";
import { money } from "../../../utils";
import { ReceiptModal } from "./ReceiptModal";

export function PosSalesPage() {
  const { state, setState, location, notify } = useDemo();
  const products = state.items.filter(
    (i) => ["Bakery product", "Prepared meal", "Beverage"].includes(i.type) && i.active
  );
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [payment, setPayment] = useState("Cash");
  const [employeeId, setEmployeeId] = useState("");
  const [receipt, setReceipt] = useState(null);

  const eligibleCredit =
    location === "Araliya Factory Canteen" && state.features[location]?.["Employee Credit"];
  const employee = state.employees.find(
    (e) => e.id.toLowerCase() === employeeId.toLowerCase()
  );
  const total = cart.reduce((a, i) => a + i.price * i.qty, 0);

  const locationPrice = (x) =>
    x.price +
    (location === "Araliya Factory Canteen" && x.type !== "Prepared meal"
      ? -20
      : location === "Riverside Restaurant"
      ? 30
      : 0);

  const add = (x) => {
    const current = cart.find((i) => i.name === x.name)?.qty || 0;
    const available = state.inventory[location]?.[x.name] || 0;
    if (x.tracked && current + 1 > available)
      return notify(`Only ${available} ${x.name} available`);
    setCart((c) =>
      c.some((i) => i.name === x.name)
        ? c.map((i) => (i.name === x.name ? { ...i, qty: i.qty + 1 } : i))
        : [...c, { name: x.name, qty: 1, price: locationPrice(x), tracked: x.tracked }]
    );
  };

  const complete = () => {
    if (!cart.length) return notify("Add at least one product to the cart");
    if (payment === "Employee Credit" && (!employee || !employee.eligible || !employee.active))
      return notify("Enter an active, eligible employee ID");
    if (payment === "Employee Credit" && employee && employee.balance < total)
      return notify(`Insufficient credit. Available balance is ${money(employee.balance)}`);
    for (const i of cart)
      if (i.tracked && (state.inventory[location]?.[i.name] || 0) < i.qty)
        return notify(`Insufficient tracked stock for ${i.name}`);

    const id = `SAL-2026-${String(state.sales.length + 1).padStart(4, "0")}`;
    const sale = {
      id,
      date: new Date().toLocaleString("en-LK"),
      location,
      cashier: "Kavindi Silva",
      items: cart.map(({ name, qty, price }) => ({ name, qty, price })),
      total,
      payment,
      employeeId: payment === "Employee Credit" ? employee?.id : undefined,
      status: "Completed",
    };

    setState((s) => {
      const nextInv = { ...s.inventory[location] };
      cart
        .filter((i) => i.tracked)
        .forEach((i) => (nextInv[i.name] = (nextInv[i.name] || 0) - i.qty));
      const next = {
        ...s,
        sales: [...s.sales, sale],
        inventory: { ...s.inventory, [location]: nextInv },
      };
      if (payment === "Employee Credit" && employee) {
        const balance = employee.balance - total;
        next.employees = s.employees.map((e) =>
          e.id === employee.id ? { ...e, balance } : e
        );
        next.ledger = [
          ...s.ledger,
          {
            id: `CRD-${Date.now()}`,
            employeeId: employee.id,
            date: sale.date,
            type: "Purchase",
            saleRef: id,
            debit: total,
            credit: 0,
            balance,
          },
        ];
      }
      return next;
    });

    setReceipt(sale);
    setCart([]);
    notify(
      payment === "Employee Credit" && employee?.optIn
        ? "Sale completed; purchase email event queued"
        : "Sale completed and stock updated"
    );
  };

  const filtered = products.filter(
    (x) =>
      (category === "All" ||
        (category === "Bakery"
          ? x.type === "Bakery product"
          : x.category === category)) &&
      x.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="pos-header">
        <div>
          <div className="eyebrow">POINT OF SALE · {location.toUpperCase()}</div>
          <h1>New sale</h1>
        </div>
        <div className="till-status">
          <i /> Till open <span>Cashier · Kavindi Silva</span>
        </div>
      </div>
      <div className="pos-layout">
        <section className="pos-products">
          <Search
            value={search}
            onChange={setSearch}
            placeholder="Search by product name or code…"
          />
          <div className="category-pills">
            {["All", "Bakery", "Meals", "Beverages"].map((x) => (
              <button
                key={x}
                className={category === x ? "active" : ""}
                onClick={() => setCategory(x)}
              >
                {x}
              </button>
            ))}
          </div>
          <div className="product-grid">
            {filtered.map((x) => (
              <button className="product-card" onClick={() => add(x)} key={x.code}>
                <div className={`product-art ${x.category.toLowerCase()}`}>
                  {x.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <small>{x.code}</small>
                  <h3>{x.name}</h3>
                  <b>{money(locationPrice(x))}</b>
                  {x.tracked && (
                    <span>{state.inventory[location]?.[x.name] || 0} available</span>
                  )}
                </div>
                <i>
                  <Icon name="plus" />
                </i>
              </button>
            ))}
          </div>
        </section>
        <aside className="cart-panel">
          <div className="cart-head">
            <div>
              <span>ACTIVE ORDER</span>
              <h2>Current cart</h2>
            </div>
            <b>{cart.reduce((a, x) => a + x.qty, 0)} items</b>
          </div>
          <div className="cart-items">
            {cart.length ? (
              cart.map((x) => (
                <div className="cart-item" key={x.name}>
                  <div>
                    <b>{x.name}</b>
                    <small>{money(x.price)} each</small>
                  </div>
                  <div className="qty">
                    <button
                      onClick={() =>
                        setCart((c) =>
                          c.flatMap((i) =>
                            i.name === x.name
                              ? i.qty === 1
                                ? []
                                : [{ ...i, qty: i.qty - 1 }]
                              : [i]
                          )
                        )
                      }
                    >
                      −
                    </button>
                    <b>{x.qty}</b>
                    <button
                      onClick={() => {
                        const item = products.find((i) => i.name === x.name);
                        if (item) add(item);
                      }}
                    >
                      +
                    </button>
                  </div>
                  <strong>{money(x.price * x.qty)}</strong>
                </div>
              ))
            ) : (
              <Empty title="Cart is empty" detail="Select a product to begin a sale." />
            )}
          </div>
          <div className="cart-bottom">
            <div className="totals">
              <span>
                Subtotal <b>{money(total)}</b>
              </span>
              <span>
                Tax <b>Included</b>
              </span>
              <strong>
                Total payable <b>{money(total)}</b>
              </strong>
            </div>
            <div className="payment-methods">
              <span>PAYMENT METHOD</span>
              {["Cash", "External Card", ...(eligibleCredit ? ["Employee Credit"] : [])].map(
                (x) => (
                  <button
                    key={x}
                    className={payment === x ? "active" : ""}
                    onClick={() => setPayment(x)}
                  >
                    <Icon name={x === "Cash" ? "file" : "credit"} />
                    {x}
                  </button>
                )
              )}
            </div>
            {payment === "Employee Credit" && (
              <div className="employee-lookup">
                <Field label="Employee ID">
                  <input
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="e.g. EMP-1042"
                  />
                </Field>
                {employee && (
                  <div className="employee-result">
                    <span>
                      {employee.name
                        .split(" ")
                        .map((x) => x[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                    <div>
                      <b>{employee.name}</b>
                      <small>
                        {employee.position} · {employee.eligible ? "Eligible" : "Not eligible"}
                      </small>
                    </div>
                    <strong>{money(employee.balance)}</strong>
                  </div>
                )}
              </div>
            )}
            <Button className="complete-sale" onClick={complete}>
              Complete sale · {money(total)} <Icon name="arrow" />
            </Button>
            <small className="terminal-note">
              {payment === "External Card"
                ? "Record payment after approval on the external terminal."
                : "Payments in this prototype are simulated."}
            </small>
          </div>
        </aside>
      </div>
      {receipt && <ReceiptModal sale={receipt} close={() => setReceipt(null)} />}
    </>
  );
}
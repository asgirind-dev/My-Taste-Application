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
  StatCard,
} from "../../../components/common";
import { useDemo } from "../../../contexts/DemoStateContext";
import { money, today } from "../../../utils";

export function InvoicesPage() {
  const { state, setState, notify } = useDemo();
  const [invoice, setInvoice] = useState(null);
  const [amount, setAmount] = useState("");

  const pay = () => {
    if (!invoice) return;
    const n = Number(amount);
    const outstanding = invoice.total - invoice.paid;
    if (n <= 0 || n > outstanding)
      return notify(`Payment must be between Rs. 1 and ${money(outstanding)}`);
    setState((s) => ({
      ...s,
      invoices: s.invoices.map((x) =>
        x.id === invoice.id
          ? {
              ...x,
              paid: x.paid + n,
              payments: [
                ...x.payments,
                {
                  date: today(),
                  amount: n,
                  ref: `PAY-2026-${String(x.payments.length + 2).padStart(3, "0")}`,
                },
              ],
            }
          : x
      ),
    }));
    setInvoice(null);
    setAmount("");
    notify(`Payment of ${money(n)} recorded`);
  };

  return (
    <>
      <PageHeader
        eyebrow="SUPPLIER FINANCE"
        title="Invoices & payments"
        description="Track supplier obligations and record partial settlements without exceeding balances."
      />
      <div className="stats three">
        <StatCard
          label="Total invoiced"
          value={money(state.invoices.reduce((a, x) => a + x.total, 0))}
          icon="file"
        />
        <StatCard
          label="Amount paid"
          value={money(state.invoices.reduce((a, x) => a + x.paid, 0))}
          tone="green"
          icon="check"
        />
        <StatCard
          label="Outstanding"
          value={money(state.invoices.reduce((a, x) => a + x.total - x.paid, 0))}
          tone="orange"
          icon="credit"
        />
      </div>
      <Card
        title="Supplier invoices"
        action={
          <select>
            <option>All invoices</option>
            <option>Outstanding only</option>
          </select>
        }
      >
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Supplier / purchase</th>
                <th>Invoice date</th>
                <th>Due date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Outstanding</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {state.invoices.map((x) => {
                const out = x.total - x.paid;
                return (
                  <tr key={x.id}>
                    <td>
                      <b>{x.id}</b>
                    </td>
                    <td>
                      {x.supplier}
                      <small>{x.purchase}</small>
                    </td>
                    <td>{x.date}</td>
                    <td>{x.due}</td>
                    <td>{money(x.total)}</td>
                    <td>{money(x.paid)}</td>
                    <td>
                      <b>{money(out)}</b>
                    </td>
                    <td>
                      <Badge>{out === 0 ? "Paid" : x.paid ? "Partially Paid" : "Unpaid"}</Badge>
                    </td>
                    <td>
                      <button className="table-action" onClick={() => setInvoice(x)}>
                        {out ? "Record payment" : "View history"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      {invoice && (
        <Modal
          title={
            invoice.total === invoice.paid ? "Payment history" : `Record payment · ${invoice.id}`
          }
          description={`${invoice.supplier} · Outstanding ${money(invoice.total - invoice.paid)}`}
          onClose={() => setInvoice(null)}
        >
          <div className="payment-history">
            {invoice.payments.map((x) => (
              <div key={x.ref}>
                <span>
                  <Icon name="check" />
                </span>
                <div>
                  <b>{money(x.amount)}</b>
                  <small>
                    {x.ref} · {x.date}
                  </small>
                </div>
              </div>
            ))}
            {!invoice.payments.length && <p>No payments recorded.</p>}
          </div>
          {invoice.total > invoice.paid && (
            <>
              <Field label="Payment amount (LKR)">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  max={invoice.total - invoice.paid}
                />
              </Field>
              <ModalActions close={() => setInvoice(null)} submit={pay} label="Record payment" />
            </>
          )}
        </Modal>
      )}
    </>
  );
}
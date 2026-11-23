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
import { money } from "../../../utils";

export function VoidsPage() {
  const { state, setState, role, notify } = useDemo();
  const [modal, setModal] = useState(false);
  const [saleId, setSaleId] = useState(
    state.sales.find((s) => s.status === "Completed")?.id || ""
  );
  const [reason, setReason] = useState("Duplicate billing");

  const submit = () => {
    if (state.voids.some((v) => v.saleId === saleId && v.status !== "Rejected"))
      return notify("An active void request already exists for this sale");
    setState((s) => ({
      ...s,
      voids: [
        ...s.voids,
        {
          id: `VOID-2026-${String(s.voids.length + 1).padStart(3, "0")}`,
          saleId,
          reason,
          notes: "Submitted by cashier for manager review.",
          status: "Pending",
          requestedBy: "Kavindi Silva",
          stockVerified: false,
        },
      ],
    }));
    setModal(false);
    notify("Void request sent to the branch manager");
  };

  const decide = (v, approved) => {
    const sale = state.sales.find((s) => s.id === v.saleId);
    if (!sale || v.status !== "Pending") return;
    setState((s) => {
      const next = {
        ...s,
        voids: s.voids.map((x) =>
          x.id === v.id ? { ...x, status: approved ? "Approved" : "Rejected" } : x
        ),
        sales: approved
          ? s.sales.map((x) => (x.id === sale.id ? { ...x, status: "VOIDED" } : x))
          : s.sales,
      };
      if (approved && sale.payment === "Employee Credit" && sale.employeeId) {
        const employee = s.employees.find((e) => e.id === sale.employeeId);
        const balance = employee.balance + sale.total;
        next.employees = s.employees.map((e) =>
          e.id === employee.id ? { ...e, balance } : e
        );
        next.ledger = [
          ...s.ledger,
          {
            id: `CRD-${Date.now()}`,
            employeeId: employee.id,
            date: new Date().toLocaleString(),
            type: "Void reversal",
            saleRef: sale.id,
            debit: 0,
            credit: sale.total,
            balance,
          },
        ];
      }
      return next;
    });
    notify(
      approved
        ? "Void approved; original sale preserved and corrections recorded"
        : "Void request rejected"
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="BILLING CONTROL"
        title="Void requests & approvals"
        description={
          role === "Cashier"
            ? "Request a manager review for eligible billing errors."
            : "Review billing errors while preserving the original transaction history."
        }
        actions={
          role === "Cashier" ? (
            <Button onClick={() => setModal(true)}>
              <Icon name="plus" /> Request void
            </Button>
          ) : undefined
        }
      />
      <div className="rule-banner">
        <Icon name="file" />
        <div>
          <b>Original sales are never deleted</b>
          <span>
            Credit reversals post separately. Cash/card corrections remain manual, and stock returns
            require physical saleability verification.
          </span>
        </div>
      </div>
      <Card title={role === "Cashier" ? "My void requests" : "Manager approval queue"}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Request</th>
                <th>Receipt</th>
                <th>Cashier</th>
                <th>Sale amount</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {state.voids.map((v) => {
                const sale = state.sales.find((s) => s.id === v.saleId);
                return (
                  <tr key={v.id}>
                    <td>
                      <b>{v.id}</b>
                    </td>
                    <td>
                      {v.saleId}
                      <small>{sale?.payment}</small>
                    </td>
                    <td>{v.requestedBy}</td>
                    <td>{money(sale?.total || 0)}</td>
                    <td>
                      {v.reason}
                      <small>{v.notes}</small>
                    </td>
                    <td>
                      <Badge>{v.status}</Badge>
                    </td>
                    <td>
                      {role === "Branch Manager" && v.status === "Pending" ? (
                        <div className="row-actions">
                          <button onClick={() => decide(v, false)}>Reject</button>
                          <button onClick={() => decide(v, true)}>Approve</button>
                        </div>
                      ) : (
                        <span className="muted">
                          {v.status === "Approved" ? "Correction recorded" : "Awaiting manager"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      {modal && (
        <Modal
          title="Request a billing-error void"
          description="Only duplicate or incorrect customer billing is eligible."
          onClose={() => setModal(false)}
        >
          <Field label="Receipt">
            <select value={saleId} onChange={(e) => setSaleId(e.target.value)}>
              {state.sales
                .filter((s) => s.status === "Completed")
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id} · {money(s.total)} · {s.payment}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Reason">
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              <option>Duplicate billing</option>
              <option>Incorrect order/customer billing</option>
            </select>
          </Field>
          <Field label="Explanatory notes">
            <textarea defaultValue="Customer reported the billing error immediately after payment." />
          </Field>
          <ModalActions close={() => setModal(false)} submit={submit} label="Submit for approval" />
        </Modal>
      )}
    </>
  );
}
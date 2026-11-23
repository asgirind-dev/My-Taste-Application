import { Button, Modal } from "../../../components/common";
import { useDemo } from "../../../contexts/DemoStateContext";
import { money } from "../../../utils";

export function ReceiptModal({ sale, close }) {
  const { state } = useDemo();
  const employee = state.employees.find((e) => e.id === sale.employeeId);

  return (
    <Modal
      title="Payment successful"
      description="The sale and related stock records have been updated."
      onClose={close}
    >
      <div className="receipt">
        <div className="receipt-brand">
          <span>M</span>
          <h2>MY TASTE</h2>
          <p>{sale.location}</p>
        </div>
        <div className="receipt-meta">
          <span>
            Receipt <b>{sale.id}</b>
          </span>
          <span>
            Date <b>{sale.date}</b>
          </span>
          <span>
            Cashier <b>{sale.cashier}</b>
          </span>
        </div>
        {sale.items.map((i, idx) => (
          <div className="receipt-line" key={idx}>
            <span>
              {i.qty} × {i.name}
            </span>
            <b>{money(i.qty * i.price)}</b>
          </div>
        ))}
        <div className="receipt-total">
          <span>TOTAL</span>
          <b>{money(sale.total)}</b>
        </div>
        <div className="receipt-meta">
          <span>
            Payment <b>{sale.payment}</b>
          </span>
          {employee && (
            <span>
              Remaining credit <b>{money(employee.balance)}</b>
            </span>
          )}
          {employee?.optIn && (
            <span>
              Email event <b>Queued</b>
            </span>
          )}
        </div>
        <p className="receipt-thanks">Thank you for choosing MY TASTE</p>
      </div>
      <div className="modal-actions">
        <Button variant="secondary" onClick={() => window.print()}>
          Print receipt
        </Button>
        <Button onClick={close}>Done</Button>
      </div>
    </Modal>
  );
}
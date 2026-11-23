import { useState } from "react";
import { Field, Modal, ModalActions } from "../common";

export function EmployeeModal({ state, close, save }) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    position: "Machine Operator",
    email: "",
  });

  return (
    <Modal
      title="Add employee"
      description="Credit eligibility can be changed later without hiding history."
      onClose={close}
    >
      <div className="form-grid">
        <Field label="Employee ID">
          <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
        </Field>
        <Field label="Full name">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Job position">
          <select
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          >
            {["Machine Operator", "Team Leader", "Technician", "Trainee"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </Field>
        <Field label="Email">
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
      </div>
      <ModalActions
        close={close}
        submit={() => {
          if (!form.id || !form.name || state.employees.some((e) => e.id === form.id)) return;
          save({ ...form, eligible: true, optIn: true, active: true, balance: 0 });
        }}
        label="Create employee"
      />
    </Modal>
  );
}
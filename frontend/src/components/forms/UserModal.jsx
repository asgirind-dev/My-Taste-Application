import { useState } from "react";
import { Field, Modal, ModalActions } from "../common";
import { locations, roles } from "../../utils";

export function UserModal({ user, close, save }) {
  const [form, setForm] = useState(user);
  const [error, setError] = useState("");

  return (
    <Modal
      title={user.id ? "Edit user access" : "Add a new user"}
      description="Assign a role and authorized operational location."
      onClose={close}
    >
      <div className="form-grid">
        <Field label="Full name" required>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Email" required>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Role">
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {roles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </Field>
        <Field label="Assigned location">
          <select
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          >
            <option>All locations</option>
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </Field>
      </div>
      <label className="switch-row">
        <span>
          <b>Active account</b>
          <small>User can sign in and access assigned modules</small>
        </span>
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm({ ...form, active: e.target.checked })}
        />
      </label>
      {error && <div className="inline-error">{error}</div>}
      <ModalActions
        close={close}
        submit={() => {
          if (!form.name || !form.email.includes("@")) {
            setError("Enter a valid name and email address.");
            return;
          }
          save(form);
        }}
        label="Save user"
      />
    </Modal>
  );
}
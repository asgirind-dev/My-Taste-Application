import { Field } from "../common";

export function FormInput({ label, name, form, setForm, type = "text" }) {
  return (
    <Field label={label} required={["name", "contact", "code"].includes(name)}>
      <input
        type={type}
        value={form[name] || ""}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      />
    </Field>
  );
}
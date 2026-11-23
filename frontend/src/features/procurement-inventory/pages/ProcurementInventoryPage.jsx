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
  Search,
} from "../../../components/common";
import { FormInput } from "../../../components/forms";
import { useDemo } from "../../../contexts/DemoStateContext";
import { money } from "../../../utils";

export function ProcurementInventoryPage() {
  const { state, setState, notify } = useDemo();
  const [tab, setTab] = useState("suppliers");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  const save = () => {
    if (tab === "suppliers") {
      if (!form.name || !form.contact)
        return notify("Supplier name and contact person are required");
      setState((s) => ({
        ...s,
        suppliers: [
          ...s.suppliers,
          {
            id: `SUP-${String(s.suppliers.length + 1).padStart(3, "0")}`,
            name: form.name,
            contact: form.contact,
            phone: form.phone || "",
            email: form.email || "",
            active: true,
            balance: 0,
          },
        ],
      }));
    } else {
      if (!form.code || !form.name) return notify("Item code and name are required");
      if (state.items.some((i) => i.code.toLowerCase() === form.code.toLowerCase()))
        return notify("That item code already exists");
      setState((s) => ({
        ...s,
        items: [
          ...s.items,
          {
            code: form.code,
            name: form.name,
            category: form.category || "General",
            type: form.type || "Raw material",
            unit: form.unit || "pcs",
            threshold: Number(form.threshold) || 0,
            tracked: true,
            active: true,
            price: 0,
          },
        ],
      }));
    }
    setModal(false);
    setForm({});
    notify(`${tab === "suppliers" ? "Supplier" : "Item"} created successfully`);
  };

  const suppliers = state.suppliers.filter((s) =>
    `${s.name} ${s.contact}`.toLowerCase().includes(search.toLowerCase())
  );
  const items = state.items.filter((i) =>
    `${i.code} ${i.name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader
        eyebrow="PROCUREMENT & INVENTORY"
        title="Suppliers & item master"
        description="Maintain approved suppliers and the products used across MY TASTE."
        actions={
          <Button onClick={() => setModal(true)}>
            <Icon name="plus" /> Add {tab === "suppliers" ? "supplier" : "item"}
          </Button>
        }
      />
      <div className="tabs">
        <button
          className={tab === "suppliers" ? "active" : ""}
          onClick={() => setTab("suppliers")}
        >
          Suppliers <span>{state.suppliers.length}</span>
        </button>
        <button className={tab === "items" ? "active" : ""} onClick={() => setTab("items")}>
          Item master <span>{state.items.length}</span>
        </button>
      </div>
      <Card>
        <div className="table-tools">
          <Search value={search} onChange={setSearch} placeholder={`Search ${tab}…`} />
          <select>
            <option>All statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {tab === "suppliers" ? (
                  <>
                    <th>Supplier</th>
                    <th>Contact</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Outstanding</th>
                    <th />
                  </>
                ) : (
                  <>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Unit</th>
                    <th>Threshold</th>
                    <th>Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {tab === "suppliers"
                ? suppliers.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <b>{s.name}</b>
                        <small>{s.id}</small>
                      </td>
                      <td>
                        {s.contact}
                        <small>{s.email}</small>
                      </td>
                      <td>{s.phone}</td>
                      <td>
                        <Badge>{s.active ? "Active" : "Inactive"}</Badge>
                      </td>
                      <td>{money(s.balance)}</td>
                      <td>
                        <button
                          className="table-action"
                          onClick={() => {
                            setState((x) => ({
                              ...x,
                              suppliers: x.suppliers.map((a) =>
                                a.id === s.id ? { ...a, active: !a.active } : a
                              ),
                            }));
                            notify(`Supplier ${s.active ? "deactivated" : "activated"}`);
                          }}
                        >
                          {s.active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))
                : items.map((i) => (
                    <tr key={i.code}>
                      <td>
                        <b>{i.name}</b>
                        <small>{i.code}</small>
                      </td>
                      <td>{i.category}</td>
                      <td>{i.type}</td>
                      <td>{i.unit}</td>
                      <td>{i.threshold}</td>
                      <td>
                        <Badge>{i.active ? "Active" : "Inactive"}</Badge>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </Card>
      {modal && (
        <Modal
          title={`Add ${tab === "suppliers" ? "supplier" : "item"}`}
          description="Fields marked with an asterisk are required."
          onClose={() => setModal(false)}
        >
          <div className="form-grid">
            {tab === "suppliers" ? (
              <>
                <FormInput label="Business name" name="name" form={form} setForm={setForm} />
                <FormInput label="Contact person" name="contact" form={form} setForm={setForm} />
                <FormInput label="Phone" name="phone" form={form} setForm={setForm} />
                <FormInput label="Email" name="email" form={form} setForm={setForm} />
              </>
            ) : (
              <>
                <FormInput label="Item code" name="code" form={form} setForm={setForm} />
                <FormInput label="Item name" name="name" form={form} setForm={setForm} />
                <FormInput label="Category" name="category" form={form} setForm={setForm} />
                <Field label="Item type">
                  <select onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option>Raw material</option>
                    <option>Bakery product</option>
                    <option>Prepared meal</option>
                    <option>Beverage</option>
                  </select>
                </Field>
                <FormInput label="Unit" name="unit" form={form} setForm={setForm} />
                <FormInput label="Minimum threshold" name="threshold" form={form} setForm={setForm} />
              </>
            )}
          </div>
          <ModalActions close={() => setModal(false)} submit={save} label="Create record" />
        </Modal>
      )}
    </>
  );
}
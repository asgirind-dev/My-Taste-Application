import { useState } from "react";
import { Badge, Button, Card, DashboardIntro, Icon, Search, StatCard } from "../../../components/common";
import { UserModal } from "../../../components/forms";
import { Timeline } from "../../../components/tables";
import { useDemo } from "../../../contexts/DemoStateContext";

export function AdminDashboardPage() {
  const { state, setState, notify, navigate } = useDemo();
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState(null);

  const users = state.users.filter((u) =>
    `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <DashboardIntro
        role="Administrator"
        title="Good morning, Anushka"
        text="Here's a consolidated view of people, locations, and platform activity."
      />
      <div className="stats five">
        <StatCard label="Active users" value={state.users.filter((u) => u.active).length} detail="Across 5 roles" icon="users" />
        <StatCard label="Locations" value="5" detail="All operational" icon="store" tone="blue" />
        <StatCard
          label="Enabled features"
          value={Object.values(state.features).flatMap(Object.values).filter(Boolean).length}
          detail="Of 25 configurations"
          icon="settings"
          tone="orange"
        />
        <StatCard label="Unread alerts" value={state.notifications.filter((n) => !n.read).length} detail="Require review" icon="bell" tone="orange" />
        <StatCard label="Audit events" value={state.audit.length} detail="Latest today" icon="file" tone="green" />
      </div>
      <div className="grid-main">
        <Card
          title="User management"
          subtitle="Roles and location access"
          action={
            <Button
              onClick={() =>
                setEdit({
                  id: "",
                  name: "",
                  email: "",
                  role: "Cashier",
                  location: "Araliya Factory Canteen",
                  active: true,
                  last: "Never",
                })
              }
            >
              <Icon name="plus" /> Add user
            </Button>
          }
        >
          <div className="table-tools">
            <Search value={search} onChange={setSearch} placeholder="Search users…" />
            <Button variant="secondary" onClick={() => navigate("/settings")}>
              Location settings
            </Button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Last activity</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="person">
                        <span>
                          {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </span>
                        <div>
                          <b>{u.name}</b>
                          <small>{u.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{u.role}</td>
                    <td>{u.location}</td>
                    <td><Badge>{u.active ? "Active" : "Inactive"}</Badge></td>
                    <td>{u.last}</td>
                    <td>
                      <button className="table-action" onClick={() => setEdit(u)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card
          title="Recent activity"
          subtitle="Latest recorded audit events"
          action={
            <button className="link" onClick={() => navigate("/audit")}>
              View all
            </button>
          }
        >
          <Timeline rows={state.audit.slice(0, 5)} />
        </Card>
      </div>
      {edit && (
        <UserModal
          user={edit}
          close={() => setEdit(null)}
          save={(u) => {
            setState((s) => ({
              ...s,
              users: u.id
                ? s.users.map((x) => (x.id === u.id ? u : x))
                : [...s.users, { ...u, id: `USR-${String(s.users.length + 1).padStart(3, "0")}` }],
            }));
            setEdit(null);
            notify("User access profile saved");
          }}
        />
      )}
    </>
  );
}
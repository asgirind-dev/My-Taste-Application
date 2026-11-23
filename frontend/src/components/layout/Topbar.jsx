import { useNavigate, useLocation } from "react-router-dom";
import { useDemo } from "../../contexts/DemoStateContext";
import { Icon } from "../common";
import { navMeta, roles, pathToRoute } from "../../utils";

export function Topbar({ setMobileNav, mobileNav }) {
  const { role, location, setLocation, state, switchRole } = useDemo();
  const navigate = useNavigate();
  const loc = useLocation();
  const route = pathToRoute[loc.pathname] || "dashboard";

  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)}>
        <Icon name="menu" />
      </button>
      <div className="breadcrumb">
        <span>MY TASTE</span>
        <Icon name="arrow" size={13} />
        <b>{navMeta[route].label}</b>
      </div>
      <div className="top-actions">
        {(role === "Branch Manager" || role === "Cashier") && (
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="Current location"
          >
            {["Downtown Restaurant", "Riverside Restaurant", "Araliya Factory Canteen"].map(
              (l) => (
                <option key={l}>{l}</option>
              )
            )}
          </select>
        )}
        <button
          className="bell"
          onClick={() => navigate("/notifications")}
          aria-label="Notifications"
        >
          <Icon name="bell" />
          <span>{state.notifications.filter((n) => !n.read).length}</span>
        </button>
        <div className="profile">
          <div className="avatar">
            {role
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <strong>{role === "Cashier" ? "Kavindi Silva" : role}</strong>
            <span>{location}</span>
          </div>
        </div>
        <select
          className="role-switch"
          value={role}
          onChange={(e) => switchRole(e.target.value)}
          aria-label="Switch demo role"
        >
          {roles.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
    </header>
  );
}
import { useNavigate, useLocation } from "react-router-dom";
import { useDemo } from "../../contexts/DemoStateContext";
import { Icon } from "../common";
import { navMeta, roleRoutes, routeToPath, pathToRoute } from "../../utils";

export function Sidebar({ collapsed, setCollapsed, mobileNav, setMobileNav }) {
  const { role, reset, signOut } = useDemo();
  const navigate = useNavigate();
  const loc = useLocation();

  const activeRoute = pathToRoute[loc.pathname] || "dashboard";


  const allowedRoutes = roleRoutes[role] || [];

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileNav ? "mobile-open" : ""}`}
    >
      <div className="brand">
        <div className="brand-mark">M</div>
        {!collapsed && (
          <div>
            <strong>MY TASTE</strong>
            <span>Operations Suite</span>
          </div>
        )}
      </div>
      <nav>
        {!collapsed && <div className="nav-label">WORKSPACE</div>}
        

        {allowedRoutes.map((item) => (
          <button
            key={item}
            className={activeRoute === item ? "active" : ""}
            title={navMeta[item].label}
            onClick={() => {
              navigate(routeToPath[item]);
              setMobileNav(false);
            }}
          >
            <Icon name={navMeta[item].icon} />
            {!collapsed && <span>{navMeta[item].label}</span>}
            {activeRoute === item && <i />}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        {!collapsed && (
          <div className="demo-note">
            <span>DEMO MODE</span>
            <p>Changes are saved in this browser.</p>
          </div>
        )}
        <button onClick={reset}>
          <Icon name="settings" />
          {!collapsed && <span>Reset Demo Data</span>}
        </button>
        <button onClick={signOut}>
          <Icon name="logout" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
      <button className="collapse-button" onClick={() => setCollapsed(!collapsed)}>
        <Icon name="arrow" size={15} />
      </button>
    </aside>
  );
}
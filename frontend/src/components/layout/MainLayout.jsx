import { NavLink, Outlet } from "react-router-dom";

const modules = [
  { path: "/procurement-inventory", label: "M01 - Procurement & Inventory" },
  { path: "/bakery-production", label: "M02 - Bakery Production" },
  { path: "/stock-distribution", label: "M03 - Stock Distribution" },
  { path: "/administration", label: "M04 - Administration" },
  { path: "/pos-sales", label: "M05 - POS & Sales" },
  { path: "/employee-credit", label: "M06 - Employee Credit" },
];

function MainLayout() {
  return (
    <div className="main-layout">
      <header className="app-header">
        <h1>MY TASTE</h1>
        <p>Integrated Multi-Branch Food Business Management System</p>
      </header>

      <nav className="module-navigation">
        <NavLink to="/" end>
          Home
        </NavLink>

        {modules.map((module) => (
          <NavLink key={module.path} to={module.path}>
            {module.label}
          </NavLink>
        ))}
      </nav>

      <main className="module-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;

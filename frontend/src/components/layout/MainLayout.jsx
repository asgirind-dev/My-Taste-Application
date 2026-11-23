import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useDemo } from "../../contexts/DemoStateContext";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Toast } from "./Toast";

export default function MainLayout() {
  const { signedIn } = useDemo();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  if (!signedIn) return <Navigate to="/signin" replace />;

  return (
    <div className="app">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileNav={mobileNav}
        setMobileNav={setMobileNav}
      />
      <main className={`main ${collapsed ? "expanded" : ""}`}>
        <Topbar setMobileNav={setMobileNav} mobileNav={mobileNav} />
        <div className="content">
          <Outlet />
        </div>
      </main>
      <Toast />
    </div>
  );
}
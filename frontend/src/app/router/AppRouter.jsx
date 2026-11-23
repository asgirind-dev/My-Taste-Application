import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { SignIn } from "../../components/layout/SignIn";
import { useDemo } from "../../contexts/DemoStateContext";
import { roleRoutes, pathToRoute } from "../../utils";

// administration
import { AdministrationPage } from "../../features/administration/pages/AdministrationPage";
import { AuditPage } from "../../features/administration/pages/AuditPage";
import { NotificationsPage } from "../../features/administration/pages/NotificationsPage";
import { AdminDashboardPage } from "../../features/administration/pages/DashboardPage";

// procurement
import { ProcurementInventoryPage } from "../../features/procurement-inventory/pages/ProcurementInventoryPage";
import { PurchasesPage } from "../../features/procurement-inventory/pages/PurchasesPage";
import { InvoicesPage } from "../../features/procurement-inventory/pages/InvoicesPage";
import { StockDashboardPage } from "../../features/procurement-inventory/pages/DashboardPage";

// bakery
import { BakeryProductionPage } from "../../features/bakery-production/pages/BakeryProductionPage";
import { BakeryDashboardPage } from "../../features/bakery-production/pages/DashboardPage";

// stock distribution
import { StockDistributionPage } from "../../features/stock-distribution/pages/StockDistributionPage";
import { BranchDashboardPage } from "../../features/stock-distribution/pages/DashboardPage";
import { ReportsPage } from "../../features/stock-distribution/pages/ReportsPage";

// pos-sales
import { PosSalesPage } from "../../features/pos-sales/pages/PosSalesPage";
import { VoidsPage } from "../../features/pos-sales/pages/VoidsPage";
import { CashierDashboardPage } from "../../features/pos-sales/pages/DashboardPage";

// employee-credit
import { EmployeeCreditPage } from "../../features/employee-credit/pages/EmployeeCreditPage";
import { LedgerPage } from "../../features/employee-credit/pages/LedgerPage";


function ProtectedRoute({ route }) {
  const { role } = useDemo();
  const allowedRoutes = roleRoutes[role] || [];

  if (!allowedRoutes.includes(route)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function DashboardRouter() {
  const { role } = useDemo();
  if (role === "Administrator") return <AdminDashboardPage />;
  if (role === "Stock Keeper") return <StockDashboardPage />;
  if (role === "Bakery Supervisor") return <BakeryDashboardPage />;
  if (role === "Branch Manager") return <BranchDashboardPage />;
  if (role === "Cashier") return <CashierDashboardPage />;
  return <Navigate to="/" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardRouter />} />
        

        
        {/* administration */}
        <Route element={<ProtectedRoute route="settings" />}>
          <Route path="/settings" element={<AdministrationPage />} />
        </Route>
        <Route element={<ProtectedRoute route="audit" />}>
          <Route path="/audit" element={<AuditPage />} />
        </Route>
        <Route element={<ProtectedRoute route="notifications" />}>
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        {/* procurement */}
        <Route element={<ProtectedRoute route="suppliers" />}>
          <Route path="/suppliers" element={<ProcurementInventoryPage />} />
        </Route>
        <Route element={<ProtectedRoute route="purchases" />}>
          <Route path="/purchases" element={<PurchasesPage />} />
        </Route>
        <Route element={<ProtectedRoute route="invoices" />}>
          <Route path="/invoices" element={<InvoicesPage />} />
        </Route>

        {/* bakery */}
        <Route element={<ProtectedRoute route="production" />}>
          <Route path="/production" element={<BakeryProductionPage />} />
        </Route>

        {/* stock distribution */}
        <Route element={<ProtectedRoute route="distribution" />}>
          <Route path="/distribution" element={<StockDistributionPage />} />
        </Route>
        <Route element={<ProtectedRoute route="reports" />}>
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        {/* pos-sales */}
        <Route element={<ProtectedRoute route="pos" />}>
          <Route path="/pos" element={<PosSalesPage />} />
        </Route>
        <Route element={<ProtectedRoute route="voids" />}>
          <Route path="/voids" element={<VoidsPage />} />
        </Route>

        {/* employee-credit */}
        <Route element={<ProtectedRoute route="credit" />}>
          <Route path="/credit" element={<EmployeeCreditPage />} />
        </Route>
        <Route element={<ProtectedRoute route="ledger" />}>
          <Route path="/ledger" element={<LedgerPage />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
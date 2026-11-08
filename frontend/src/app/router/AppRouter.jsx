import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";

import ProcurementInventoryPage from "../../features/procurement-inventory/pages/ProcurementInventoryPage";
import BakeryProductionPage from "../../features/bakery-production/pages/BakeryProductionPage";
import StockDistributionPage from "../../features/stock-distribution/pages/StockDistributionPage";
import AdministrationPage from "../../features/administration/pages/AdministrationPage";
import PosSalesPage from "../../features/pos-sales/pages/PosSalesPage";
import EmployeeCreditPage from "../../features/employee-credit/pages/EmployeeCreditPage";

function HomePage() {
  return (
    <section>
      <h2>Welcome to MY TASTE</h2>
      <p>Select a module from the navigation menu.</p>
    </section>
  );
}

function NotFoundPage() {
  return <h2>404 - Page Not Found</h2>;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />

          <Route
            path="procurement-inventory"
            element={<ProcurementInventoryPage />}
          />

          <Route
            path="bakery-production"
            element={<BakeryProductionPage />}
          />

          <Route
            path="stock-distribution"
            element={<StockDistributionPage />}
          />

          <Route
            path="administration"
            element={<AdministrationPage />}
          />

          <Route
            path="pos-sales"
            element={<PosSalesPage />}
          />

          <Route
            path="employee-credit"
            element={<EmployeeCreditPage />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;

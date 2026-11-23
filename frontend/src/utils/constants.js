export const locations = [
  "Central Warehouse",
  "Main Bakery",
  "Downtown Restaurant",
  "Riverside Restaurant",
  "Araliya Factory Canteen",
];

export const roles = [
  "Administrator",
  "Stock Keeper",
  "Bakery Supervisor",
  "Branch Manager",
  "Cashier",
];

export const roleRoutes = {
  Administrator: ["dashboard", "settings", "credit", "reports", "notifications", "ledger", "audit"],
  "Stock Keeper": ["dashboard", "suppliers", "purchases", "invoices", "distribution", "reports", "notifications"],
  "Bakery Supervisor": ["dashboard", "production", "distribution", "reports", "notifications"],
  "Branch Manager": ["dashboard", "distribution", "voids", "reports", "notifications"],
  Cashier: ["dashboard", "pos", "voids", "notifications"],
};

export const roleLocation = {
  Administrator: "All locations",
  "Stock Keeper": "Central Warehouse",
  "Bakery Supervisor": "Main Bakery",
  "Branch Manager": "Downtown Restaurant",
  Cashier: "Araliya Factory Canteen",
};

export const navMeta = {
  dashboard: { label: "Overview", icon: "dashboard" },
  suppliers: { label: "Suppliers & Items", icon: "users" },
  purchases: { label: "Purchasing", icon: "cart" },
  invoices: { label: "Invoices & Payments", icon: "file" },
  production: { label: "Bakery Production", icon: "store" },
  distribution: { label: "Stock Distribution", icon: "truck" },
  pos: { label: "Point of Sale", icon: "cart" },
  voids: { label: "Void Requests", icon: "file" },
  credit: { label: "Employee Credit", icon: "credit" },
  reports: { label: "Reports & Analytics", icon: "report" },
  notifications: { label: "Notifications", icon: "bell" },
  ledger: { label: "Credit Ledger", icon: "file" },
  audit: { label: "Audit Logs", icon: "file" },
  settings: { label: "Configuration", icon: "settings" },
};

export const routeToPath = {
  dashboard: "/",
  settings: "/settings",
  credit: "/credit",
  reports: "/reports",
  notifications: "/notifications",
  ledger: "/ledger",
  audit: "/audit",
  suppliers: "/suppliers",
  purchases: "/purchases",
  invoices: "/invoices",
  distribution: "/distribution",
  production: "/production",
  pos: "/pos",
  voids: "/voids",
};

export const pathToRoute = Object.fromEntries(
  Object.entries(routeToPath).map(([k, v]) => [v, k])
);
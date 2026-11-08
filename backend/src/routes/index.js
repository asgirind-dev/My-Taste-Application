import { Router } from "express";

import procurementInventoryRoutes from "../modules/procurement-inventory/routes/index.js";
import bakeryProductionRoutes from "../modules/bakery-production/routes/index.js";
import stockDistributionRoutes from "../modules/stock-distribution/routes/index.js";
import administrationRoutes from "../modules/administration/routes/index.js";
import posSalesRoutes from "../modules/pos-sales/routes/index.js";
import employeeCreditRoutes from "../modules/employee-credit/routes/index.js";

const router = Router();

router.use("/procurement-inventory", procurementInventoryRoutes);
router.use("/bakery-production", bakeryProductionRoutes);
router.use("/stock-distribution", stockDistributionRoutes);
router.use("/administration", administrationRoutes);
router.use("/pos-sales", posSalesRoutes);
router.use("/employee-credit", employeeCreditRoutes);

export default router;

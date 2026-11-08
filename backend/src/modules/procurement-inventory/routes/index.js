
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    module: "M01 - Procurement & Central Inventory Management",
    message: "Procurement & Inventory API is running",
  });
});

export default router;

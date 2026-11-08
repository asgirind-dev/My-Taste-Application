import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    module: "M06 - Employee Canteen Credit Management",
    message: "Employee Credit API is running",
  });
});

export default router;

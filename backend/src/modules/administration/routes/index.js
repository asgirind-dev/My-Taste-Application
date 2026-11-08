import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    module: "M04 - System Administration & Access Control",
    message: "Administration API is running",
  });
});

export default router;

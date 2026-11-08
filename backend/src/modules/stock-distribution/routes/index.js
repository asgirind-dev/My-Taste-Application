import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    module: "M03 - Multi-Branch Stock Requests & Distribution",
    message: "Stock Distribution API is running",
  });
});

export default router;

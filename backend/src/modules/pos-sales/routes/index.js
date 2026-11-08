import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    module: "M05 - Multi-Branch POS & Sales Management",
    message: "POS & Sales API is running",
  });
});

export default router;

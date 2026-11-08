import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    module: "M02 - Bakery Production & Daily Planning",
    message: "Bakery Production API is running",
  });
});

export default router;

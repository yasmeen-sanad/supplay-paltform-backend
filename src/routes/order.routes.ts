import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { createOrderHandler, getMyOrdersHandler, getOrderByIdHandler } from "../controllers/order.controller";

const router = Router();

router.post("/", protect, createOrderHandler);
router.get("/my-orders", protect, getMyOrdersHandler);
router.get("/:id", protect, getOrderByIdHandler);

export default router;

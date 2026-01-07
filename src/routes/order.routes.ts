import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { createOrderHandler, getMyOrdersHandler, getOrderByIdHandler } from "../controllers/order.controller";
import {
  validateOrderCreation,
  validateMongoId,
  handleValidationErrors
} from "../middleware/validation.middleware";

const router = Router();

router.post("/", protect, validateOrderCreation, handleValidationErrors, createOrderHandler);
router.get("/my-orders", protect, getMyOrdersHandler);
router.get("/:id", protect, validateMongoId("id"), handleValidationErrors, getOrderByIdHandler);

export default router;

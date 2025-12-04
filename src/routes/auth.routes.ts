import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { login, me, register, updateProfile, updateMyShippingMethod } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.patch("/update-profile", protect, updateProfile);
router.patch("/me/shipping-method", protect, updateMyShippingMethod);

export default router;

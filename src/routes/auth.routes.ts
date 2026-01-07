import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { 
  login, 
  me, 
  register, 
  updateProfile, 
  updateMyShippingMethod 
} from "../controllers/auth.controller";
import {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateShippingMethod,
  handleValidationErrors
} from "../middleware/validation.middleware";

const router = Router();

router.post("/register", validateUserRegistration, handleValidationErrors, register);
router.post("/login", validateUserLogin, handleValidationErrors, login);
router.get("/me", protect, me);
router.patch("/update-profile", protect, validateUserUpdate, handleValidationErrors, updateProfile);
router.patch("/me/shipping-method", protect, validateShippingMethod, handleValidationErrors, updateMyShippingMethod);

export default router;

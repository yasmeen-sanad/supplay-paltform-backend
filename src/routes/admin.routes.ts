import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.middleware";
import {
  getVendors,
  getVendorDetails,
  approveVendorHandler,
  rejectVendorHandler,
  getSettings,
  updateSettings,
  uploadLogo,
} from "../controllers/admin.controller";
import { registerAdminHandler, promoteToAdminHandler, checkAdminExists } from "../controllers/admin-auth.controller";
import { loginUser } from "../services/auth.service";
import { handleValidationErrors, validateAdminRegistration } from "../middleware/validation.middleware";

const router = Router();

// Public admin routes (no authentication required)
router.get("/check", checkAdminExists);
router.post("/register", validateAdminRegistration, handleValidationErrors, registerAdminHandler);
router.post("/login", async (req, res) => {
  try {
    const result = await loginUser(req.body);
    
    // Check if user is admin
    if (result.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "ليس لديك صلاحية للوصول إلى لوحة التحكم",
      });
    }

    return res.status(200).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    // Handle login errors
    if (error.message === "VALIDATION_LOGIN_FIELDS") {
      return res.status(400).json({
        success: false,
        message: "يجب إدخال البريد الإلكتروني أو رقم الجوال وكلمة المرور",
      });
    }
    if (error.message === "USER_NOT_FOUND") {
      return res.status(401).json({
        success: false,
        message: "المستخدم غير موجود",
      });
    }
    if (error.message === "INVALID_PASSWORD") {
      return res.status(401).json({
        success: false,
        message: "كلمة المرور غير صحيحة",
      });
    }

    return res.status(500).json({
      success: false,
      message: "خطأ في السيرفر",
      error: error.message,
    });
  }
});
router.post("/promote", promoteToAdminHandler);

// Protected admin routes (require authentication and admin role)
router.use(protect);
router.use(restrictTo("admin"));

// Vendor management routes
router.get("/vendors", getVendors);
router.get("/vendors/:vendorId", getVendorDetails);
router.patch("/vendors/:vendorId/approve", approveVendorHandler);
router.patch("/vendors/:vendorId/reject", rejectVendorHandler);

// Platform settings routes
router.get("/settings", getSettings);
router.patch("/settings", uploadLogo.single("logo"), updateSettings);

export default router;


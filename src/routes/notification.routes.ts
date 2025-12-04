import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { getNotifications } from "../controllers/notification.controller";

const router = Router();

router.get("/", protect, getNotifications);

export default router;

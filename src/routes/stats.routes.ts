import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { getStatsHandler } from "../controllers/stats.controller";

const router = Router();

router.get("/", protect, getStatsHandler);

export default router;

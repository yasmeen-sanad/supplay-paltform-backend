import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import { getStats } from "../services/stats.service";

export async function getStatsHandler(req: AuthedRequest, res: Response) {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "غير مصرح بالوصول" });
    }

    const stats = await getStats();

    return res.status(200).json({ success: true, stats });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في جلب الإحصائيات",
      error: error.message,
    });
  }
}

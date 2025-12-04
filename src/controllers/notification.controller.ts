import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";

export async function getNotifications(req: AuthedRequest, res: Response) {
  try {
    const notifications = [
      {
        id: 1,
        title: "مرحباً بك في بناء مارت",
        message: "تم إنشاء حسابك بنجاح",
        type: "info",
        isRead: false,
        createdAt: new Date(),
      },
      {
        id: 2,
        title: "عرض خاص",
        message: "خصم 10% على جميع مواد البناء هذا الأسبوع",
        type: "promotion",
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ];

    return res.status(200).json({ success: true, count: notifications.length, notifications });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في جلب الإشعارات",
      error: error.message,
    });
  }
}

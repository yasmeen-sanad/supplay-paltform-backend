import { Request, Response } from "express";
import { registerAdmin, promoteUserToAdmin } from "../services/admin-auth.service";
import { User } from "../models/user.model";

export async function registerAdminHandler(req: Request, res: Response) {
  try {
    const result = await registerAdmin(req.body);

    return res.status(201).json({
      success: true,
      message: "تم إنشاء حساب المشرف بنجاح",
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    if (error.message === "VALIDATION_REQUIRED_FIELDS") {
      return res.status(400).json({
        success: false,
        message: "جميع الحقول مطلوبة",
      });
    }
    if (error.message === "INVALID_ADMIN_SECRET_CODE") {
      return res.status(403).json({
        success: false,
        message: "رمز المشرف السري غير صحيح",
      });
    }
    if (error.message === "ADMIN_ALREADY_EXISTS") {
      // Get the existing admin email to show helpful message
      const existingAdmin = await User.findOne({ role: "admin" });
      return res.status(409).json({
        success: false,
        message: "تم إنشاء حساب المشرف مسبقاً. يرجى تسجيل الدخول بدلاً من ذلك",
        existingAdminEmail: existingAdmin?.email || null,
      });
    }
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(400).json({
        success: false,
        message: "البريد الإلكتروني مسجل مسبقاً",
      });
    }

    return res.status(500).json({
      success: false,
      message: "خطأ في السيرفر",
      error: error.message,
    });
  }
}

export async function promoteToAdminHandler(req: Request, res: Response) {
  try {
    const { email, adminSecretCode } = req.body;

    if (!email || !adminSecretCode) {
      return res.status(400).json({
        success: false,
        message: "البريد الإلكتروني ورمز المشرف السري مطلوبان",
      });
    }

    const result = await promoteUserToAdmin(email, adminSecretCode);

    return res.status(200).json({
      success: true,
      message: "تم ترقية الحساب إلى مشرف بنجاح",
      user: result,
    });
  } catch (error: any) {
    if (error.message === "INVALID_ADMIN_SECRET_CODE") {
      return res.status(403).json({
        success: false,
        message: "رمز المشرف السري غير صحيح",
      });
    }
    if (error.message === "ADMIN_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "يوجد مشرف آخر بالفعل. يمكن أن يكون هناك مشرف واحد فقط.",
      });
    }
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "المستخدم غير موجود",
      });
    }

    return res.status(500).json({
      success: false,
      message: "خطأ في السيرفر",
      error: error.message,
    });
  }
}

export async function checkAdminExists(req: Request, res: Response) {
  try {
    const admin = await User.findOne({ role: "admin" });
    
    return res.status(200).json({
      success: true,
      exists: !!admin,
      admin: admin ? {
        email: admin.email,
        name: admin.name,
      } : null,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في السيرفر",
      error: error.message,
    });
  }
}

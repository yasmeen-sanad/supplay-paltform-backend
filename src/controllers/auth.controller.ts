import { Request, Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import { User } from "../models/user.model";
import { loginUser, registerUser } from "../services/auth.service";

export async function register(req: Request, res: Response) {
  try {
    const result = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    if (error.message === "VALIDATION_REQUIRED_FIELDS") {
      return res.status(400).json({
        success: false,
        message: "الاسم، البريد الإلكتروني وكلمة المرور مطلوبة",
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

export async function login(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body);

    return res.status(200).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
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
}

export async function me(req: AuthedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "غير مصرح" });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      address: req.user.address,
      city: req.user.city,
      logo: req.user.logo,
      shippingMethod: (req.user as any).shippingMethod,
      createdAt: req.user.createdAt ? req.user.createdAt.toString() : null,
    },
  });
}

export async function updateProfile(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "غير مصرح" });
    }

    const { name, email, phone, address } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "المستخدم غير موجود" });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        phone: updated.phone,
        address: updated.address,
        city: updated.city,
        logo: updated.logo,
        shippingMethod: (updated as any).shippingMethod,
        createdAt: updated.createdAt ? updated.createdAt.toString() : null,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في تحديث الملف الشخصي",
      error: error.message,
    });
  }
}

export async function updateMyShippingMethod(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "غير مصرح" });
    }

    const { shippingMethod } = req.body as { shippingMethod?: "standard" | "express" | "same-day" };
    if (!shippingMethod) {
      return res.status(400).json({ success: false, message: "طريقة الشحن مطلوبة" });
    }

    const allowed: string[] = ["standard", "express", "same-day"];
    if (!allowed.includes(shippingMethod)) {
      return res.status(400).json({ success: false, message: "طريقة الشحن غير صالحة" });
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { shippingMethod },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "المستخدم غير موجود" });
    }

    return res.status(200).json({
      success: true,
      shippingMethod: updated.shippingMethod,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في تحديث طريقة الشحن",
      error: error.message,
    });
  }
}

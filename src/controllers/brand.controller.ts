import { Request, Response } from "express";
import { User } from "../models/user.model";
import { AuthedRequest } from "../middleware/auth.middleware";

export async function getBrands(req: Request, res: Response) {
  try {
    const sellers = await User.find({ role: "seller" }).select("name email city logo");

    return res.status(200).json({
      success: true,
      count: sellers.length,
      brands: sellers,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في جلب العلامات التجارية",
      error: error.message,
    });
  }
}

export async function updateMyBrandLogo(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "غير مصرح" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "ملف الشعار مطلوب" });
    }

    // Stored by multer under uploads/brands; expose as a relative path for the frontend
    const relativePath = `/uploads/brands/${req.file.filename}`;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { logo: relativePath },
      { new: true, runValidators: true }
    ).select("name email city logo");

    if (!updated) {
      return res.status(404).json({ success: false, message: "الحساب غير موجود" });
    }

    return res.status(200).json({ success: true, brand: updated });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في رفع الشعار",
      error: error.message,
    });
  }
}

export async function getMyBrand(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "غير مصرح" });
    }

    const seller = await User.findById(req.user._id).select("name email city logo");
    if (!seller) {
      return res.status(404).json({ success: false, message: "الحساب غير موجود" });
    }

    return res.status(200).json({ success: true, brand: seller });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في جلب بيانات العلامة التجارية",
      error: error.message,
    });
  }
}

export async function updateMyBrand(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "غير مصرح" });
    }

    const { name, logo } = req.body as { name?: string; logo?: string };

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { ...(name && { name }), ...(logo && { logo }) },
      { new: true, runValidators: true }
    ).select("name email city logo");

    if (!updated) {
      return res.status(404).json({ success: false, message: "الحساب غير موجود" });
    }

    return res.status(200).json({ success: true, brand: updated });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في تحديث بيانات العلامة التجارية",
      error: error.message,
    });
  }
}

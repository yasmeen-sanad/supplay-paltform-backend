import { Response } from "express";
import path from "path";
import { listFactories, createFactoryForSeller, listFactoriesForSeller, updateFactoryForSeller, deleteFactoryForSeller } from "../services/factory.service";
import { AuthedRequest } from "../middleware/auth.middleware";
import { Factory } from "../models/factory.model";

export async function getFactories(req: AuthedRequest, res: Response) {
  try {
    const factories = await listFactories();
    return res.status(200).json({ success: true, count: factories.length, factories });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في جلب المصانع",
      error: error.message,
    });
  }
}

export async function createFactory(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "يجب تسجيل الدخول" });
    }

    const data: any = { ...req.body };
    if (req.file) {
      data.image = `/uploads/factories/${req.file.filename}`;
    }

    const factory = await createFactoryForSeller(req.user.id, data);
    return res.status(201).json({ success: true, factory });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في إنشاء المصنع",
      error: error.message,
    });
  }
}

export async function getMyFactories(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "يجب تسجيل الدخول" });
    }

    const factories = await listFactoriesForSeller(req.user.id);
    return res.status(200).json({ success: true, count: factories.length, factories });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في جلب مصانع البائع",
      error: error.message,
    });
  }
}

export async function updateFactory(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "يجب تسجيل الدخول" });
    }

    const data: any = { ...req.body };
    if (req.file) {
      data.image = `/uploads/factories/${req.file.filename}`;
    }

    const factory = await updateFactoryForSeller(req.user.id, req.params.id, data);
    if (!factory) {
      return res.status(404).json({ success: false, message: "المصنع غير موجود أو غير مملوك لك" });
    }

    return res.status(200).json({ success: true, factory });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في تحديث المصنع",
      error: error.message,
    });
  }
}

export async function deleteFactory(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "يجب تسجيل الدخول" });
    }

    const factory = await deleteFactoryForSeller(req.user.id, req.params.id);
    if (!factory) {
      return res.status(404).json({ success: false, message: "المصنع غير موجود أو غير مملوك لك" });
    }

    return res.status(204).json({ success: true, message: "تم حذف المصنع" });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في حذف المصنع",
      error: error.message,
    });
  }
}

export async function uploadFactoryImage(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "يجب تسجيل الدخول" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "ملف الصورة مطلوب" });
    }

    const factoryId = req.params.id;

    // Multer stores images under uploads/factories; expose as a relative path for the frontend
    const relativePath = `/uploads/factories/${req.file.filename}`;

    const factory = await Factory.findOneAndUpdate(
      { _id: factoryId, seller: req.user.id },
      { image: relativePath },
      { new: true, runValidators: true }
    );

    if (!factory) {
      return res.status(404).json({ success: false, message: "المصنع غير موجود أو غير مملوك لك" });
    }

    return res.status(200).json({ success: true, factory });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في رفع صورة المصنع",
      error: error.message,
    });
  }
}

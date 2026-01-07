import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import {
  getAllVendors,
  getVendorById,
  approveVendor,
  rejectVendor,
  getPlatformSettings,
  updatePlatformSettings,
} from "../services/admin.service";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads", "platform");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `logo-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const uploadLogo = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("يجب أن يكون الملف صورة"));
    }
  },
});

export async function getVendors(req: AuthedRequest, res: Response) {
  try {
    const status = req.query.status as "pending" | "approved" | "rejected" | undefined;
    const vendors = await getAllVendors(status);

    return res.status(200).json({
      success: true,
      vendors,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في جلب البائعين",
      error: error.message,
    });
  }
}

export async function getVendorDetails(req: AuthedRequest, res: Response) {
  try {
    const { vendorId } = req.params;
    const vendor = await getVendorById(vendorId);

    return res.status(200).json({
      success: true,
      vendor,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "البائع غير موجود",
    });
  }
}

export async function approveVendorHandler(req: AuthedRequest, res: Response) {
  try {
    const { vendorId } = req.params;
    const vendor = await approveVendor(vendorId);

    return res.status(200).json({
      success: true,
      message: "تم الموافقة على البائع بنجاح",
      vendor: {
        _id: vendor._id,
        name: vendor.name,
        vendorStatus: vendor.vendorStatus,
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "فشل في الموافقة على البائع",
    });
  }
}

export async function rejectVendorHandler(req: AuthedRequest, res: Response) {
  try {
    const { vendorId } = req.params;
    const vendor = await rejectVendor(vendorId);

    return res.status(200).json({
      success: true,
      message: "تم رفض البائع بنجاح",
      vendor: {
        _id: vendor._id,
        name: vendor.name,
        vendorStatus: vendor.vendorStatus,
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "فشل في رفض البائع",
    });
  }
}

export async function getSettings(req: AuthedRequest, res: Response) {
  try {
    const settings = await getPlatformSettings();

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في جلب إعدادات المنصة",
      error: error.message,
    });
  }
}

export async function updateSettings(req: AuthedRequest, res: Response) {
  try {
    const { platformName, removeLogo } = req.body;
    const data: any = {};

    // Handle platform name (allow empty string)
    if (platformName !== undefined) {
      data.platformName = platformName;
    }

    // Handle logo removal
    if (removeLogo === "true") {
      data.platformLogo = "";
    }
    // Handle logo upload
    else if (req.file) {
      data.platformLogo = `/uploads/platform/${req.file.filename}`;
    }

    const settings = await updatePlatformSettings(data);

    return res.status(200).json({
      success: true,
      message: "تم تحديث الإعدادات بنجاح",
      settings,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في تحديث الإعدادات",
      error: error.message,
    });
  }
}


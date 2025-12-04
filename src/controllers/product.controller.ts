import { Response } from "express";
import {
  listProducts,
  getProductById,
  searchProducts,
  createProductForSeller,
  listProductsForSeller,
  updateProductForSeller,
  deleteProductForSeller,
} from "../services/product.service";
import { AuthedRequest } from "../middleware/auth.middleware";

export async function getProducts(req: AuthedRequest, res: Response) {
  try {
    const products = await listProducts();
    return res.status(200).json({ success: true, count: products.length, products });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في جلب المنتجات",
      error: error.message,
    });
  }
}

export async function createProduct(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "يجب تسجيل الدخول" });
    }

    // Log incoming data for debugging
    console.log("Creating product with data:", req.body);
    console.log("User ID:", req.user.id);
    console.log("Uploaded file:", req.file);

    const data: any = { ...req.body };
    
    // Convert string fields to proper types
    if (data.price) data.price = Number(data.price);
    if (data.stock) data.stock = Number(data.stock);
    if (data.shippingCost) data.shippingCost = Number(data.shippingCost);
    
    // Handle image upload
    if (req.file) {
      data.image = `/uploads/products/${req.file.filename}`;
    }

    // Ensure seller is set
    data.seller = req.user.id;

    console.log("Processed data:", data);

    const product = await createProductForSeller(req.user.id, data);
    return res.status(201).json({ success: true, product });
  } catch (error: any) {
    console.error("Error creating product:", error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        message: "خطأ في التحقق من البيانات",
        errors: errors
      });
    }
    
    // Handle other errors
    return res.status(500).json({
      success: false,
      message: "خطأ في إنشاء المنتج",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

export async function getMyProducts(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "يجب تسجيل الدخول" });
    }

    const products = await listProductsForSeller(req.user.id);
    return res.status(200).json({ success: true, count: products.length, products });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في جلب منتجات البائع",
      error: error.message,
    });
  }
}

export async function updateProduct(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "يجب تسجيل الدخول" });
    }

    const data: any = { ...req.body };
    if (req.file) {
      data.image = `/uploads/products/${req.file.filename}`;
    }

    const product = await updateProductForSeller(req.user.id, req.params.id, data);
    if (!product) {
      return res.status(404).json({ success: false, message: "المنتج غير موجود أو غير مملوك لك" });
    }

    return res.status(200).json({ success: true, product });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في تحديث المنتج",
      error: error.message,
    });
  }
}

export async function deleteProduct(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "يجب تسجيل الدخول" });
    }

    const product = await deleteProductForSeller(req.user.id, req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "المنتج غير موجود أو غير مملوك لك" });
    }

    return res.status(204).json({ success: true, message: "تم حذف المنتج" });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في حذف المنتج",
      error: error.message,
    });
  }
}

export async function getProduct(req: AuthedRequest, res: Response) {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "المنتج غير موجود" });
    }
    return res.status(200).json({ success: true, product });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في جلب المنتج",
      error: error.message,
    });
  }
}

export async function searchProductsHandler(req: AuthedRequest, res: Response) {
  try {
    const { q, category, minPrice, maxPrice } = req.query as {
      q?: string;
      category?: string;
      minPrice?: string;
      maxPrice?: string;
    };

    const products = await searchProducts({ q, category, minPrice, maxPrice });
    return res.status(200).json({ success: true, count: products.length, products });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في البحث",
      error: error.message,
    });
  }
}

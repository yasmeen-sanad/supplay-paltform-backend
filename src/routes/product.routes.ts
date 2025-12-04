import { Router } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import {
  getProduct,
  getProducts,
  searchProductsHandler,
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { protect, restrictTo } from "../middleware/auth.middleware";

const router = Router();

const productImagesDir = path.join(process.cwd(), "uploads", "products");
if (!fs.existsSync(productImagesDir)) {
  fs.mkdirSync(productImagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, productImagesDir);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || "";
    cb(null, `product-${unique}${ext}`);
  },
});

const upload = multer({ storage });

// Public endpoints
router.get("/", getProducts);
router.get("/search", searchProductsHandler);
router.get("/:id", getProduct);

// Seller-protected endpoints
router.use(protect, restrictTo("seller"));
router.post("/", upload.single("image"), createProduct);
router.get("/me/mine", getMyProducts);
router.patch("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;

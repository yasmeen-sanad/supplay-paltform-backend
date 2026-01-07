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
import { protect, restrictTo, requireApprovedSeller } from "../middleware/auth.middleware";
import {
  validateProductCreation,
  validateProductUpdate,
  validateProductSearch,
  validateMongoId,
  handleValidationErrors
} from "../middleware/validation.middleware";

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
router.get("/search", validateProductSearch, handleValidationErrors, searchProductsHandler);
router.get("/:id", validateMongoId("id"), handleValidationErrors, getProduct);

// Seller-protected endpoints
router.use(protect, restrictTo("seller"));
router.post("/", requireApprovedSeller, upload.single("image"), validateProductCreation, handleValidationErrors, createProduct);
router.get("/me/mine", getMyProducts);
router.patch("/:id", requireApprovedSeller, upload.single("image"), validateMongoId("id"), validateProductUpdate, handleValidationErrors, updateProduct);
router.delete("/:id", requireApprovedSeller, validateMongoId("id"), handleValidationErrors, deleteProduct);

export default router;

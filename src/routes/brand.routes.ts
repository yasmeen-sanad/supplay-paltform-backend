import { Router } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { getBrands, getMyBrand, updateMyBrand, updateMyBrandLogo } from "../controllers/brand.controller";
import { protect, restrictTo } from "../middleware/auth.middleware";

const router = Router();

const brandLogosDir = path.join(process.cwd(), "uploads", "brands");
if (!fs.existsSync(brandLogosDir)) {
  fs.mkdirSync(brandLogosDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, brandLogosDir);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || "";
    cb(null, `brand-${unique}${ext}`);
  },
});

const upload = multer({ storage });

// Public: list all seller brands
router.get("/", getBrands);

// Seller-only: manage own brand
router.use(protect, restrictTo("seller"));
router.get("/me", getMyBrand);
router.patch("/me", updateMyBrand);
router.post("/me/logo", upload.single("logo"), updateMyBrandLogo);

export default router;

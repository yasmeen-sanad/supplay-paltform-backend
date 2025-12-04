import { Router } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import {
  getFactories,
  createFactory,
  getMyFactories,
  updateFactory,
  deleteFactory,
} from "../controllers/factory.controller";
import { protect, restrictTo } from "../middleware/auth.middleware";

const router = Router();

const factoryImagesDir = path.join(process.cwd(), "uploads", "factories");
if (!fs.existsSync(factoryImagesDir)) {
  fs.mkdirSync(factoryImagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, factoryImagesDir);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || "";
    cb(null, `factory-${unique}${ext}`);
  },
});

const upload = multer({ storage });

// Public endpoints
router.get("/", getFactories);

// Seller-protected endpoints
router.use(protect, restrictTo("seller"));
router.post("/", upload.single("image"), createFactory);
router.get("/me/mine", getMyFactories);
router.patch("/:id", upload.single("image"), updateFactory);
router.delete("/:id", deleteFactory);

export default router;

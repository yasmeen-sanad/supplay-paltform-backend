import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import factoryRoutes from "./routes/factory.routes";
import notificationRoutes from "./routes/notification.routes";
import statsRoutes from "./routes/stats.routes";
import brandRoutes from "./routes/brand.routes";

export const allowedOrigins = [
  "https://supply-platform.netlify.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5001",
  "https://one23-6-l3re.onrender.com",
];

export const app = express();

// CORS setup
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("CORS Blocked for origin:", origin);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.options("*", cors());

app.use(express.json());

// Static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "بناء مارت - Backend شغال!",
    status: "نجاح",
    version: "3.0.0",
    cors: "مفعل للنطاقات المسموحة",
    allowedOrigins,
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/factories", factoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/stats", statsRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "الصفحة غير موجودة",
    path: req.originalUrl,
  });
});

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Error:", error);
  res.status(500).json({
    success: false,
    message: "حدث خطأ غير متوقع في السيرفر",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

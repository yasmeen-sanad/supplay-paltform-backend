import express, { Request, Response, NextFunction } from "express"
import cors, { CorsOptions } from "cors"
import path from "path"

import authRoutes from "./routes/auth.routes"
import productRoutes from "./routes/product.routes"
import orderRoutes from "./routes/order.routes"
import factoryRoutes from "./routes/factory.routes"
import notificationRoutes from "./routes/notification.routes"
import statsRoutes from "./routes/stats.routes"
import brandRoutes from "./routes/brand.routes"

export const allowedOrigins = [
  "https://supply-platform.netlify.app", // الفرونت على نتلاي
  "http://localhost:3000",               // تطوير محلي
  "http://localhost:3001",
]

// تطبيق إكسبريس
export const app = express()

// إعداد CORS بشكل بسيط وواضح
const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}

app.use(cors(corsOptions))
// عشان preflight requests (OPTIONS)
app.options("*", cors(corsOptions))

// بارسر JSON
app.use(express.json())

// ملفات الرفع (الصور مثلاً)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))

// روت أساسي للتأكيد إن السيرفر شغال
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "بناء مارت - Backend شغال!",
    status: "success",
    version: "3.0.0",
    corsAllowedOrigins: allowedOrigins,
  })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/factories", factoryRoutes)
app.use("/api/brands", brandRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/stats", statsRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "الصفحة غير موجودة",
    path: req.originalUrl,
  })
})

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Error:", error)
  res.status(500).json({
    success: false,
    message: "حدث خطأ غير متوقع في السيرفر",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  })
})
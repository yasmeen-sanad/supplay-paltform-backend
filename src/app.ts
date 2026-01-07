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
import adminRoutes from "./routes/admin.routes"

export const allowedOrigins = [
  "https://supply-platform.netlify.app",
  "http://localhost:3000",
  "http://localhost:3001",
]

export const app = express()

// CORS Configuration - MUST BE FIRST
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.log("❌ Blocked origin:", origin)
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400, // 24 hours
}

// Apply CORS BEFORE other middleware
app.use(cors(corsOptions))
app.options("*", cors(corsOptions))

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "بناء مارت - Backend شغال!",
    status: "success",
    version: "3.0.0",
    timestamp: new Date().toISOString(),
  })
})

// Health check for monitoring
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// API Routes - Wrap in error handler
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/factories", factoryRoutes)
app.use("/api/brands", brandRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/stats", statsRoutes)
app.use("/api/admin", adminRoutes)

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "الصفحة غير موجودة",
    path: req.originalUrl,
  })
})

// Global Error Handler - MUST BE LAST
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Global Error:", {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  })

  // Send CORS headers even on error
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*")
  res.header("Access-Control-Allow-Credentials", "true")
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "حدث خطأ غير متوقع في السيرفر",
    ...(process.env.NODE_ENV === "development" && { 
      stack: error.stack,
      details: error 
    }),
  })
})
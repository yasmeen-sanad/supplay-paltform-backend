import dotenv from "dotenv";
import { app, allowedOrigins } from "./app";
import { connectDB } from "./config/db";

dotenv.config();

async function start() {
  await connectDB();
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`✅ السيرفر شغال على البورت ${PORT}`);
    console.log(`🌐 CORS مفعل للنطاقات: ${allowedOrigins.join(", ")}`);
    console.log("🚀 Ready to accept requests from allowed origins");
  });
}

start().catch(err => {
  console.error("❌ Failed to start server:", err);
});

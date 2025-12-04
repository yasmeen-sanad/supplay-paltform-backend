import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://buildmart:Buildmart123@cluster0.nsddhfd.mongodb.net/buildmart?retryWrites=true&w=majority";

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      // @ts-expect-error mongoose connection options
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ قاعدة البيانات متصلة");
  } catch (err) {
    console.log("❌ خطأ في الاتصال:", err);
  }
}

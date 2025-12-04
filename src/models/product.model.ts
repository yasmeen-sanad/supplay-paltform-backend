import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  // يجب أن تتطابق مع enum الفئة في مخطط المنتج أدناه
  category:
    | "المواد الكميائىة"
    | "البناء والعقار"
    | "المركبات وملحقاتها"
    | "الزراعة"
    | "الاضادة والمصابيح"
    | "الاجهزة"
    | "ملابس و أزياء"
    | "معدات وخدمات تجارية"
    | "مطاط بلاستيك واسفنج"
    | "المنزل والحديقة"
    | "الماعدن والتعدين"
    | "معدات الخدمات التجارية";
  image: string;
  stock: number;
  supplier: string;

  isActive: boolean;
  seller: mongoose.Types.ObjectId;
  factory?: mongoose.Types.ObjectId;
  brand?: string;
  color: string;
  size: string;
  feature1?: string;
  feature2?: string;
  feature3?: string;
  shippingMethod?: "standard" | "express" | "same-day";
  shippingCost?: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: [true, "اسم المنتج مطلوب"], trim: true },
    description: { type: String, required: [true, "وصف المنتج مطلوب"] },
    price: { type: Number, required: [true, "سعر المنتج مطلوب"], min: [0, "السعر لا يمكن أن يكون سالب"] },
    category: {
      type: String,
      required: [true, "فئة المنتج مطلوبة"],
      enum: [
        "المواد الكميائىة",
        "البناء والعقار",
        "المركبات وملحقاتها",
        "الزراعة",
        "الاضادة والمصابيح",
        "الاجهزة",
        "ملابس و أزياء",
        "معدات وخدمات تجارية",
        "مطاط بلاستيك واسفنج",
        "المنزل والحديقة",
        "الماعدن والتعدين",
        "معدات الخدمات التجارية",
      ],
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300x200?text=منتج+بناء",
    },
    stock: {
      type: Number,
      required: [true, "الكمية المتاحة مطلوبة"],
      min: [0, "الكمية لا يمكن أن تكون سالبة"],
    },
    supplier: { type: String, required: [true, "المورد مطلوب"] },
    
    isActive: { type: Boolean, default: true },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "مالك المنتج (البائع) مطلوب"],
    },
    factory: {
      type: Schema.Types.ObjectId,
      ref: "Factory",
    },
    brand: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      required: [true, "لون المنتج مطلوب"],
      trim: true,
    },
    size: {
      type: String,
      required: [true, "مقاس المنتج مطلوب"],
      trim: true,
    },
    feature1: {
      type: String,
      trim: true,
    },
    feature2: {
      type: String,
      trim: true,
    },
    feature3: {
      type: String,
      trim: true,
    },
    shippingMethod: {
      type: String,
      enum: ["standard", "express", "same-day"],
      default: "standard",
    },
    shippingCost: {
      type: Number,
      min: [0, "تكلفة الشحن لا يمكن أن تكون سالبة"],
      default: 50,
    },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);

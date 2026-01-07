import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  logo?: string;
  role: "customer" | "admin" | "seller";
  vendorStatus?: "pending" | "approved" | "rejected";
  shippingMethod?: "standard" | "express" | "same-day";
  createdAt?: Date;
  updatedAt?: Date;
  correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, "الاسم مطلوب"], trim: true },
    email: {
      type: String,
      required: [true, "البريد الإلكتروني مطلوب"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "كلمة المرور مطلوبة"],
      minlength: [6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"],
      select: false,
    },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    logo: {
      type: String,
      trim: true,
      default: "/placeholder-brand-logo.png",
    },
    role: {
      type: String,
      enum: ["customer", "admin", "seller"],
      default: "customer",
    },
    vendorStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: undefined,
    },
    shippingMethod: {
      type: String,
      enum: ["standard", "express", "same-day"],
      default: "standard",
    },
  },
  { timestamps: true }
);

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

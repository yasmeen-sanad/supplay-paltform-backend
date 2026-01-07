import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlatformSettings extends Document {
  id: string;
  platformName: string;
  platformLogo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const platformSettingsSchema = new Schema<IPlatformSettings>(
  {
    id: {
      type: String,
      default: "default",
      unique: true,
    },
    platformName: {
      type: String,
      required: [true, "اسم المنصة مطلوب"],
      default: "بناء مارت",
    },
    platformLogo: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const PlatformSettings: Model<IPlatformSettings> =
  mongoose.model<IPlatformSettings>("PlatformSettings", platformSettingsSchema);


import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFactory extends Document {
  name: string;
  location: string;
  image: string;
  productsCount: number;
  category?: string;
  contactEmail?: string;
  contactPhone?: string;
  seller: mongoose.Types.ObjectId;
}

const factorySchema = new Schema<IFactory>(
  {
    name: { type: String, required: [true, "اسم المصنع مطلوب"], trim: true },
    location: { type: String, required: [true, "الموقع مطلوب"], trim: true },
    image: { type: String, default: "" },
    productsCount: { type: Number, default: 0 },
    category: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "مالك المصنع (البائع) مطلوب"],
    },
  },
  { timestamps: true }
);

export const Factory: Model<IFactory> = mongoose.model<IFactory>("Factory", factorySchema);

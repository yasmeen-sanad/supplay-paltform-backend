import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  products: IOrderItem[];
  totalAmount: number;
  status: string;
  shippingAddress: string;
  phone: string;
  paymentMethod: string;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, required: true },
        name: String,
        price: Number,
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "bank_transfer"],
      default: "cash",
    },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

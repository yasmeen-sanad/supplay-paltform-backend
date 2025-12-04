import { IOrderItem, Order } from "../models/order.model";

export async function createOrder(data: {
  userId: string;
  products: IOrderItem[];
  totalAmount: number;
  shippingAddress: string;
  phone: string;
  paymentMethod?: string;
}) {
  const { userId, products, totalAmount, shippingAddress, phone, paymentMethod } = data;

  if (!products || !totalAmount || !shippingAddress || !phone) {
    throw new Error("VALIDATION_ORDER_FIELDS");
  }

  const newOrder = await Order.create({
    user: userId,
    products,
    totalAmount,
    shippingAddress,
    phone,
    paymentMethod: paymentMethod || "cash",
  });

  const orderWithUser = await Order.findById(newOrder._id).populate("user", "name email phone");
  return orderWithUser;
}

export async function getUserOrders(userId: string) {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
}

export async function getUserOrderById(userId: string, orderId: string) {
  return Order.findOne({ _id: orderId, user: userId });
}

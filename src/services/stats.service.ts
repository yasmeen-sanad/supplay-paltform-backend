import { User } from "../models/user.model";
import { Product } from "../models/product.model";
import { Order } from "../models/order.model";

export async function getStats() {
  const usersCount = await User.countDocuments();
  const productsCount = await Product.countDocuments();
  const ordersCount = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);

  return {
    users: usersCount,
    products: productsCount,
    orders: ordersCount,
    revenue: totalRevenue[0]?.total || 0,
  };
}

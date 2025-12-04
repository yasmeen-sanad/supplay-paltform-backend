import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import { createOrder, getUserOrderById, getUserOrders } from "../services/order.service";

export async function createOrderHandler(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "غير مصرح" });
    }

    const { products, totalAmount, shippingAddress, phone, paymentMethod } = req.body;

    const order = await createOrder({
      userId: req.user._id.toString(),
      products,
      totalAmount,
      shippingAddress,
      phone,
      paymentMethod,
    });

    return res.status(201).json({
      success: true,
      message: "تم إنشاء الطلب بنجاح",
      order,
    });
  } catch (error: any) {
    if (error.message === "VALIDATION_ORDER_FIELDS") {
      return res.status(400).json({
        success: false,
        message: "المنتجات، المبلغ الإجمالي، العنوان ورقم الجوال مطلوبة",
      });
    }

    return res.status(500).json({
      success: false,
      message: "خطأ في إنشاء الطلب",
      error: error.message,
    });
  }
}

export async function getMyOrdersHandler(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "غير مصرح" });
    }

    const orders = await getUserOrders(req.user._id.toString());
    return res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في جلب الطلبات",
      error: error.message,
    });
  }
}

export async function getOrderByIdHandler(req: AuthedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "غير مصرح" });
    }

    const order = await getUserOrderById(req.user._id.toString(), req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "الطلب غير موجود" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "خطأ في جلب الطلب",
      error: error.message,
    });
  }
}

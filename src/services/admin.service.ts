import { User } from "../models/user.model";
import { Product } from "../models/product.model";
import { Order } from "../models/order.model";
import { PlatformSettings } from "../models/platform-settings.model";
import mongoose from "mongoose";

export async function getAllVendors(status?: "pending" | "approved" | "rejected") {
  const filter: any = { role: "seller" };
  if (status) {
    filter.vendorStatus = status;
  }

  const vendors = await User.find(filter).sort({ createdAt: -1 });

  // Get product count and customer count for each vendor
  const vendorsWithStats = await Promise.all(
    vendors.map(async (vendor) => {
      const productCount = await Product.countDocuments({ seller: vendor._id });
      
      // Get unique customers who have ordered from this vendor
      // First, get all product IDs for this vendor
      const vendorProducts = await Product.find({ seller: vendor._id }).select("_id");
      const productIds = vendorProducts.map((p) => p._id);
      
      // Then find orders that contain these products
      const orders = await Order.find({
        "products.productId": { $in: productIds },
      });

      const customerIds = new Set<string>();
      orders.forEach((order) => {
        order.products.forEach((item: any) => {
          const productIdStr = item.productId?.toString();
          if (productIdStr && productIds.some((id) => id.toString() === productIdStr)) {
            customerIds.add(order.user.toString());
          }
        });
      });

      return {
        _id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        logo: vendor.logo,
        vendorStatus: vendor.vendorStatus || "pending",
        productCount,
        customerCount: customerIds.size,
        createdAt: vendor.createdAt,
        phone: vendor.phone,
        address: vendor.address,
        city: vendor.city,
      };
    })
  );

  return vendorsWithStats;
}

export async function getVendorById(vendorId: string) {
  const vendor = await User.findById(vendorId);
  if (!vendor || vendor.role !== "seller") {
    throw new Error("البائع غير موجود");
  }

  const productCount = await Product.countDocuments({ seller: vendor._id });
  
  // Get unique customers
  // First, get all product IDs for this vendor
  const vendorProducts = await Product.find({ seller: vendor._id }).select("_id");
  const productIds = vendorProducts.map((p) => p._id);
  
  // Then find orders that contain these products
  const orders = await Order.find({
    "products.productId": { $in: productIds },
  });

  const customerIds = new Set<string>();
  orders.forEach((order) => {
    order.products.forEach((item: any) => {
      const productIdStr = item.productId?.toString();
      if (productIdStr && productIds.some((id) => id.toString() === productIdStr)) {
        customerIds.add(order.user.toString());
      }
    });
  });

  return {
    _id: vendor._id,
    name: vendor.name,
    email: vendor.email,
    logo: vendor.logo,
    vendorStatus: vendor.vendorStatus || "pending",
    productCount,
    customerCount: customerIds.size,
    createdAt: vendor.createdAt,
    phone: vendor.phone,
    address: vendor.address,
    city: vendor.city,
  };
}

export async function approveVendor(vendorId: string) {
  const vendor = await User.findByIdAndUpdate(
    vendorId,
    { vendorStatus: "approved" },
    { new: true, runValidators: true }
  );

  if (!vendor || vendor.role !== "seller") {
    throw new Error("البائع غير موجود");
  }

  return vendor;
}

export async function rejectVendor(vendorId: string) {
  const vendor = await User.findByIdAndUpdate(
    vendorId,
    { vendorStatus: "rejected" },
    { new: true, runValidators: true }
  );

  if (!vendor || vendor.role !== "seller") {
    throw new Error("البائع غير موجود");
  }

  return vendor;
}

export async function getPlatformSettings() {
  let settings = await PlatformSettings.findOne({ id: "default" });
  
  if (!settings) {
    settings = await PlatformSettings.create({
      id: "default",
      platformName: "بناء مارت",
    });
  }

  return settings;
}

export async function updatePlatformSettings(data: {
  platformName?: string;
  platformLogo?: string;
}) {
  let settings = await PlatformSettings.findOne({ id: "default" });

  if (!settings) {
    settings = await PlatformSettings.create({
      id: "default",
      platformName: data.platformName || "بناء مارت",
      platformLogo: data.platformLogo,
    });
  } else {
    if (data.platformName !== undefined) {
      settings.platformName = data.platformName;
    }
    if (data.platformLogo !== undefined) {
      settings.platformLogo = data.platformLogo;
    }
    await settings.save();
  }

  return settings;
}


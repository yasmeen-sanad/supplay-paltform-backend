import { Product } from "../models/product.model";
import { User } from "../models/user.model";
import { Factory } from "../models/factory.model";

export async function listProducts() {
  const products = await Product.find({ isActive: true }).populate("factory", "name");
  return products;
}

export async function getProductById(id: string) {
  // Populate seller basic contact info and factory name
  return Product.findById(id)
    .populate("seller", "name email phone")
    .populate("factory", "name");
}

export async function searchProducts(params: {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
}) {
  const { q, category, minPrice, maxPrice } = params;

  const filter: any = { isActive: true };
  if (q) {
    filter.name = { $regex: q, $options: "i" };
  }
  if (category) {
    filter.category = category;
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(filter);
  return products;
}

export async function createProductForSeller(sellerId: string, data: any) {
  // Get the seller's name to set as brand if not provided
  const seller = await User.findById(sellerId);
  if (!seller) {
    throw new Error("البائع غير موجود");
  }
  
  // Find factory by name if supplier is provided
  let factoryId = null;
  if (data.supplier) {
    const factory = await Factory.findOne({ name: data.supplier, seller: sellerId });
    if (factory) {
      factoryId = factory._id;
    }
  }
  
  // Set brand to seller's name if not provided in data
  const productData = {
    ...data,
    seller: sellerId,
    brand: data.brand || seller.name, // Use seller's name as brand if not specified
    factory: factoryId, // Set factory reference if found
  };
  
  const product = await Product.create(productData);
  return product;
}

export async function listProductsForSeller(sellerId: string) {
  const products = await Product.find({ seller: sellerId });
  return products;
}

export async function updateProductForSeller(sellerId: string, productId: string, data: any) {
  const product = await Product.findOneAndUpdate(
    { _id: productId, seller: sellerId },
    data,
    { new: true }
  );
  return product;
}

export async function deleteProductForSeller(sellerId: string, productId: string) {
  const product = await Product.findOneAndDelete({ _id: productId, seller: sellerId });
  return product;
}

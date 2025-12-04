import { Factory } from "../models/factory.model";

export async function listFactories() {
  const factories = await Factory.find().sort({ createdAt: -1 });
  return factories;
}

export async function seedSampleFactories() {
  // No-op: we no longer create sample factories.
}

export async function createFactoryForSeller(sellerId: string, data: any) {
  const factory = await Factory.create({ ...data, seller: sellerId });
  return factory;
}

export async function listFactoriesForSeller(sellerId: string) {
  const factories = await Factory.find({ seller: sellerId }).sort({ createdAt: -1 });
  return factories;
}

export async function updateFactoryForSeller(sellerId: string, factoryId: string, data: any) {
  const factory = await Factory.findOneAndUpdate(
    { _id: factoryId, seller: sellerId },
    data,
    { new: true }
  );
  return factory;
}

export async function deleteFactoryForSeller(sellerId: string, factoryId: string) {
  const factory = await Factory.findOneAndDelete({ _id: factoryId, seller: sellerId });
  return factory;
}

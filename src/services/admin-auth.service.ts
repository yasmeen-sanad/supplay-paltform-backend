import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { signToken } from "../middleware/auth.middleware";

export async function registerAdmin(data: {
  name: string;
  email: string;
  password: string;
  adminSecretCode: string;
}) {
  const { name, email, password, adminSecretCode } = data;

  // Validate required fields
  if (!name || !email || !password || !adminSecretCode) {
    throw new Error("VALIDATION_REQUIRED_FIELDS");
  }

  // Validate admin secret code
  const validSecretCode = process.env.ADMIN_SECRET_CODE || "ADMIN_SECRET_2024";
  if (adminSecretCode !== validSecretCode) {
    throw new Error("INVALID_ADMIN_SECRET_CODE");
  }

  // Check if admin already exists
  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    throw new Error("ADMIN_ALREADY_EXISTS");
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin user
  const newAdmin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
  });

  const token = signToken(newAdmin._id.toString());

  return {
    token,
    user: {
      id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
    },
  };
}

// Helper function to promote an existing user to admin (for development/testing)
export async function promoteUserToAdmin(email: string, adminSecretCode: string) {
  // Validate admin secret code
  const validSecretCode = process.env.ADMIN_SECRET_CODE || "ADMIN_SECRET_2024";
  if (adminSecretCode !== validSecretCode) {
    throw new Error("INVALID_ADMIN_SECRET_CODE");
  }

  // Check if admin already exists
  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin && existingAdmin.email !== email) {
    throw new Error("ADMIN_ALREADY_EXISTS");
  }

  // Find the user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  // Update user role to admin
  user.role = "admin";
  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

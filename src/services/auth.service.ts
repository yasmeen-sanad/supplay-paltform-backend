import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { signToken } from "../middleware/auth.middleware";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role?: "customer" | "admin" | "seller";
}) {
  const { name, email, password, phone, address, role } = data;

  if (!name || !email || !password) {
    throw new Error("VALIDATION_REQUIRED_FIELDS");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    role: role || "customer",
  });

  const token = signToken(newUser._id.toString());

  return {
    token,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  };
}

export async function loginUser(data: {
  email?: string;
  phone?: string;
  password: string;
}) {
  const { email, phone, password } = data;

  if ((!email && !phone) || !password) {
    throw new Error("VALIDATION_LOGIN_FIELDS");
  }

  const query: any[] = [];
  if (email) query.push({ email });
  if (phone) query.push({ phone });

  const user = await User.findOne({ $or: query }).select("+password");

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("INVALID_PASSWORD");
  }

  const token = signToken(user._id.toString());

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
}

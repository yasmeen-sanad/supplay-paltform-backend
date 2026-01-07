import { Request, Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { IUser, User } from "../models/user.model";

export const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_2024";
export const JWT_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "90d";

export function signToken(id: string): string {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export type AuthedRequest = Request & {
  user?: IUser;
};

export const protect = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "غير مصرح بالدخول، يرجى تسجيل الدخول",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "المستخدم لم يعد موجوداً",
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "جلسة منتهية، يرجى تسجيل الدخول مرة أخرى",
    });
  }
};

export const restrictTo = (...roles: Array<IUser["role"]>) => {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "ليس لديك صلاحية لتنفيذ هذا الإجراء",
      });
    }
    next();
  };
};

export const requireApprovedSeller = (req: AuthedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "غير مصرح بالدخول، يرجى تسجيل الدخول",
    });
  }

  if (req.user.role === "seller") {
    const vendorStatus = (req.user as any).vendorStatus;
    if (vendorStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: vendorStatus === "rejected" 
          ? "تم رفض حسابك من قبل الإدارة. لا يمكنك إضافة منتجات أو مصانع."
          : "حسابك قيد المراجعة. يجب أن يتم اعتماد حسابك قبل إضافة منتجات أو مصانع.",
      });
    }
  }

  next();
};

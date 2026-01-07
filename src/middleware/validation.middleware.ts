import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';

// Helper function to handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({
      success: false,
      message: 'خطأ في التحقق من البيانات',
      errors: errorMessages
    });
  }
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('الاسم مطلوب')
    .isLength({ min: 2, max: 50 })
    .withMessage('يجب أن يكون الاسم بين 2 و 50 حرفاً'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('البريد الإلكتروني غير صالح')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^05[0-9]{8}$/)
    .withMessage('رقم الجوال يجب أن يبدأ ب 05 ويحتوي على 10 أرقام'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('العنوان يجب أن يكون بين 5 و 200 حرف'),
  
  body('role')
    .optional()
    .isIn(['customer', 'seller', 'admin'])
    .withMessage('الدور يجب أن يكون customer, seller, أو admin'),
];

export const validateAdminRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('الاسم مطلوب')
    .isLength({ min: 2, max: 50 })
    .withMessage('يجب أن يكون الاسم بين 2 و 50 حرفاً'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('البريد الإلكتروني غير صالح')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم'),

  body('adminSecretCode')
    .trim()
    .notEmpty()
    .withMessage('رمز المشرف السري مطلوب'),
];

export const validateUserLogin = [
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('البريد الإلكتروني غير صالح')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^05[0-9]{8}$/)
    .withMessage('رقم الجوال يجب أن يبدأ ب 05 ويحتوي على 10 أرقام'),
  
  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة'),
  
  // Custom validation to ensure either email or phone is provided
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.phone) {
      throw new Error('يجب إدخال البريد الإلكتروني أو رقم الجوال');
    }
    return true;
  }),
];

export const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('يجب أن يكون الاسم بين 2 و 50 حرفاً'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('البريد الإلكتروني غير صالح')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^05[0-9]{8}$/)
    .withMessage('رقم الجوال يجب أن يبدأ ب 05 ويحتوي على 10 أرقام'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('العنوان يجب أن يكون بين 5 و 200 حرف'),
];

export const validateShippingMethod = [
  body('shippingMethod')
    .isIn(['standard', 'express', 'same-day'])
    .withMessage('طريقة الشحن يجب أن تكون standard, express, أو same-day'),
];

// Product validation rules
export const validateProductCreation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('اسم المنتج مطلوب')
    .isLength({ min: 2, max: 100 })
    .withMessage('يجب أن يكون اسم المنتج بين 2 و 100 حرف'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('وصف المنتج مطلوب')
    .isLength({ min: 10, max: 1000 })
    .withMessage('يجب أن يكون الوصف بين 10 و 1000 حرف'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('السعر يجب أن يكون رقماً موجباً'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('المخزون يجب أن يكون رقماً صحيحاً موجباً'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('الفئة مطلوبة')
    .isIn(['cement', 'steel', 'wood', 'paint', 'tools', 'electrical', 'plumbing', 'other'])
    .withMessage('الفئة غير صالحة'),
  
  body('shippingCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('تكلفة الشحن يجب أن تكون رقماً موجباً'),
];

export const validateProductUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('يجب أن يكون اسم المنتج بين 2 و 100 حرف'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('يجب أن يكون الوصف بين 10 و 1000 حرف'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('السعر يجب أن يكون رقماً موجباً'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('المخزون يجب أن يكون رقماً صحيحاً موجباً'),
  
  body('category')
    .optional()
    .trim()
    .isIn(['cement', 'steel', 'wood', 'paint', 'tools', 'electrical', 'plumbing', 'other'])
    .withMessage('الفئة غير صالحة'),
  
  body('shippingCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('تكلفة الشحن يجب أن تكون رقماً موجباً'),
];

// Order validation rules
export const validateOrderCreation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('يجب أن يحتوي الطلب على عنصر واحد على الأقل'),
  
  body('items.*.product')
    .isMongoId()
    .withMessage('معرف المنتج غير صالح'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('الكمية يجب أن تكون رقماً صحيحاً موجباً'),
  
  body('shippingAddress')
    .trim()
    .notEmpty()
    .withMessage('عنوان الشحن مطلوب')
    .isLength({ min: 10, max: 300 })
    .withMessage('عنوان الشحن يجب أن يكون بين 10 و 300 حرف'),
  
  body('phone')
    .trim()
    .matches(/^05[0-9]{8}$/)
    .withMessage('رقم الجوال يجب أن يبدأ ب 05 ويحتوي على 10 أرقام'),
];

// Search validation
export const validateProductSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('كلمة البحث يجب أن تكون بين 1 و 100 حرف'),
  
  query('category')
    .optional()
    .trim()
    .isIn(['cement', 'steel', 'wood', 'paint', 'tools', 'electrical', 'plumbing', 'other'])
    .withMessage('الفئة غير صالحة'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('الحد الأدنى للسعر يجب أن يكون رقماً موجباً'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('الحد الأقصى للسعر يجب أن يكون رقماً موجباً'),
  
  // Custom validation to ensure maxPrice >= minPrice
  query().custom((value, { req }) => {
    const minPrice = parseFloat(req.query.minPrice as string);
    const maxPrice = parseFloat(req.query.maxPrice as string);
    
    if (req.query.minPrice && req.query.maxPrice && maxPrice < minPrice) {
      throw new Error('الحد الأقصى للسعر يجب أن يكون أكبر من أو يساوي الحد الأدنى');
    }
    return true;
  }),
];

// ID validation
export const validateMongoId = (paramName: string) => [
  param(paramName)
    .isMongoId()
    .withMessage(`معرف ${paramName} غير صالح`),
];

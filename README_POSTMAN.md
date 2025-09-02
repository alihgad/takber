# 🚀 Takbeer API - Postman Collection

## 📁 الملفات المرفقة:

1. **`Takbeer_API_Collection.json`** - Collection كاملة لجميع الـ APIs
2. **`Takbeer_Environment.json`** - Environment مع المتغيرات
3. **`POSTMAN_SETUP_GUIDE.md`** - دليل مفصل للإعداد والاستخدام

## ⚡ الإعداد السريع:

### 1. استيراد Collection:
```
Import → Takbeer_API_Collection.json
```

### 2. استيراد Environment:
```
Import → Takbeer_Environment.json
```

### 3. اختيار Environment:
```
Environment dropdown → "Takbeer Local"
```

## 🧪 اختبار سريع:

### تسجيل دخول المدير:
```bash
POST {{base_url}}/user/signin
{
  "email": "admin@takbeer.com",
  "password": "admin123"
}
```

### إنشاء تصنيف:
```bash
POST {{base_url}}/category
Authorization: Bearer {{admin_token}}
Form-data: title=الإلكترونيات, image=[file]
```

### إنشاء منتج:
```bash
POST {{base_url}}/product
Authorization: Bearer {{admin_token}}
Form-data: title=آيفون 15, price=45000, image=[file]
```

## 📋 الـ APIs المتاحة:

### 🔐 Authentication:
- ✅ User Signup
- ✅ User Login (Admin/Data Entry/User)
- ✅ Create User (Admin Only)

### 📂 Categories:
- ✅ Get All Categories
- ✅ Get Category by ID
- ✅ Create Category (Admin/Data Entry)
- ✅ Update Category (Admin/Data Entry)
- ✅ Delete Category (Admin Only)

### 📁 Subcategories:
- ✅ Get All Subcategories
- ✅ Get by Category
- ✅ Create Subcategory (Admin/Data Entry)
- ✅ Update Subcategory (Admin/Data Entry)
- ✅ Delete Subcategory (Admin Only)

### 🛍️ Products:
- ✅ Get All Products
- ✅ Get Full Products
- ✅ Get New Arrival
- ✅ Get Hot Deals
- ✅ Create Product (Admin/Data Entry)
- ✅ Update Product (Admin/Data Entry)
- ✅ Change Photo (Admin/Data Entry)
- ✅ Delete Product (Admin Only)

### 📦 Stock:
- ✅ Get All Stock
- ✅ Get by Product
- ✅ Create Stock (Admin/Data Entry)
- ✅ Update Stock (Admin/Data Entry)
- ✅ Delete Stock (Admin Only)

### 🛒 Cart:
- ✅ Get Cart
- ✅ Add to Cart
- ✅ Update Cart Item
- ✅ Remove from Cart
- ✅ Clear Cart

### ❤️ Wishlist:
- ✅ Get Wishlist
- ✅ Add to Wishlist
- ✅ Remove from Wishlist

### 📋 Orders:
- ✅ Get All Orders (Admin)
- ✅ Get User Orders
- ✅ Create Order
- ✅ Update Order Status (Admin)

### 🎫 Coupons:
- ✅ Get All Coupons (Admin)
- ✅ Create Coupon (Admin)
- ✅ Update Coupon (Admin)
- ✅ Delete Coupon (Admin)

### 🚚 Shipping Amount:
- ✅ Get All Shipping Amounts
- ✅ Get Shipping Amount by ID
- ✅ Get Shipping Amount by City
- ✅ Create Shipping Amount (Admin)
- ✅ Update Shipping Amount (Admin)
- ✅ Delete Shipping Amount (Admin)

## 🔑 بيانات الاختبار:

### المستخدمين:
- **Admin**: `admin@takbeer.com` / `admin123`
- **Data Entry**: `dataentry@takbeer.com` / `data123`
- **User**: `test@example.com` / `12345678`

### البيانات التجريبية:
- تصنيفات: الإلكترونيات، الملابس، الأثاث
- منتجات: آيفون 15، قميص قطني، طاولة مكتب
- كوبونات: SAVE20، WELCOME10

## ⚠️ ملاحظات مهمة:

1. **تشغيل الخادم**: تأكد من تشغيل الخادم على `localhost:3000`
2. **الصور**: استخدم صور حقيقية للاختبار
3. **الـ Tokens**: سيتم تحديثها تلقائياً بعد تسجيل الدخول
4. **الـ IDs**: سيتم تحديثها تلقائياً بعد إنشاء البيانات

## 📞 للمساعدة:

راجع ملف `POSTMAN_SETUP_GUIDE.md` للحصول على دليل مفصل! 
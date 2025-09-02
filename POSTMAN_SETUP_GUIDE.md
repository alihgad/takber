# دليل إعداد Postman Collection لـ Takbeer API

## 📋 المحتويات
1. [تثبيت Collection](#تثبيت-collection)
2. [إعداد المتغيرات البيئية](#إعداد-المتغيرات-البيئية)
3. [خطوات الاختبار](#خطوات-الاختبار)
4. [بيانات الاختبار](#بيانات-الاختبار)
5. [ملاحظات مهمة](#ملاحظات-مهمة)

## 🚀 تثبيت Collection

### الخطوة 1: استيراد Collection
1. افتح Postman
2. اضغط على `Import` في الأعلى
3. اختر ملف `Takbeer_API_Collection.json`
4. اضغط `Import`

### الخطوة 2: إنشاء Environment
1. اضغط على `Environments` في الشريط الجانبي
2. اضغط `+` لإنشاء environment جديد
3. أسمه `Takbeer Local`

## ⚙️ إعداد المتغيرات البيئية

### المتغيرات الأساسية:
```
base_url: http://localhost:3000
```

### المتغيرات المطلوبة (سيتم تحديثها تلقائياً):
```
admin_token: (سيتم تحديثه بعد تسجيل دخول المدير)
user_token: (سيتم تحديثه بعد تسجيل دخول المستخدم)
data_entry_token: (سيتم تحديثه بعد تسجيل دخول مدخل البيانات)
category_id: (سيتم تحديثه بعد إنشاء تصنيف)
subcategory_id: (سيتم تحديثه بعد إنشاء تصنيف فرعي)
product_id: (سيتم تحديثه بعد إنشاء منتج)
stock_id: (سيتم تحديثه بعد إنشاء مخزون)
cart_item_id: (سيتم تحديثه بعد إضافة منتج للكارت)
wishlist_item_id: (سيتم تحديثه بعد إضافة منتج للمفضلة)
order_id: (سيتم تحديثه بعد إنشاء طلب)
coupon_id: (سيتم تحديثه بعد إنشاء كوبون)
```

## 🧪 خطوات الاختبار

### 1. تسجيل الدخول والحصول على Tokens

#### تسجيل دخول المدير:
```bash
POST {{base_url}}/user/signin
{
  "email": "admin@takbeer.com",
  "password": "admin123"
}
```

#### تسجيل دخول مدخل البيانات:
```bash
POST {{base_url}}/user/signin
{
  "email": "dataentry@takbeer.com",
  "password": "data123"
}
```

#### تسجيل دخول المستخدم:
```bash
POST {{base_url}}/user/signin
{
  "email": "test@example.com",
  "password": "12345678"
}
```

### 2. تحديث المتغيرات تلقائياً

أضف هذا الكود في `Tests` tab لكل request تسجيل دخول:

```javascript
// للـ Admin Login
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("admin_token", response.token);
}

// للـ Data Entry Login
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("data_entry_token", response.token);
}

// للـ User Login
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("user_token", response.token);
}
```

### 3. إنشاء البيانات الأساسية

#### إنشاء تصنيف:
```bash
POST {{base_url}}/category
Authorization: Bearer {{admin_token}}
Form-data:
- title: الإلكترونيات
- titleEn: Electronics
- slug: electronics
- slugEn: electronics
- description: جميع الأجهزة الإلكترونية
- descriptionEn: All electronic devices
- image: [ملف صورة]
```

#### إنشاء تصنيف فرعي:
```bash
POST {{base_url}}/subcategory
Authorization: Bearer {{admin_token}}
Form-data:
- title: الهواتف الذكية
- titleEn: Smartphones
- slug: smartphones
- slugEn: smartphones
- description: أحدث الهواتف الذكية
- descriptionEn: Latest smartphones
- categoryId: {{category_id}}
- image: [ملف صورة]
```

#### إنشاء منتج:
```bash
POST {{base_url}}/product
Authorization: Bearer {{admin_token}}
Form-data:
- title: آيفون 15 برو
- titleEn: iPhone 15 Pro
- slug: iphone-15-pro
- slugEn: iphone-15-pro
- description: أحدث آيفون من أبل
- descriptionEn: Latest iPhone from Apple
- price: 45000
- category: {{category_id}}
- brand: Apple
- discount: 10
- image: [ملف صورة]
- images: [ملفات صور إضافية]
```

#### إنشاء تكلفة الشحن:
```bash
POST {{base_url}}/shippingAmount
Authorization: Bearer {{admin_token}}
Content-Type: application/json
{
  "amount": 50,
  "city": "القاهرة",
  "active": true
}
```

### 4. تحديث IDs تلقائياً

أضف هذا الكود في `Tests` tab لكل request إنشاء:

```javascript
// للـ Create Category
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("category_id", response.category._id);
}

// للـ Create Subcategory
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("subcategory_id", response.subcategory._id);
}

// للـ Create Product
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("product_id", response.product._id);
}

// للـ Create Shipping Amount
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("shipping_amount_id", response.shippingAmount._id);
}
```

## 📊 بيانات الاختبار

### بيانات المستخدمين:

#### المدير:
- Email: `admin@takbeer.com`
- Password: `admin123`
- Role: `admin`

#### مدخل البيانات:
- Email: `dataentry@takbeer.com`
- Password: `data123`
- Role: `dataEntry`

#### المستخدم العادي:
- Email: `test@example.com`
- Password: `12345678`
- Role: `user`

### بيانات المنتجات:

#### منتج إلكتروني:
- Title: آيفون 15 برو
- Price: 45000
- Brand: Apple
- Discount: 10%

#### منتج ملابس:
- Title: قميص قطني
- Price: 200
- Brand: Cotton
- Discount: 5%

### بيانات الكوبونات:

#### كوبون خصم:
- Code: `SAVE20`
- Discount: 20%
- Max Usage: 100
- Min Order: 1000

### بيانات تكلفة الشحن:

#### تكلفة شحن القاهرة:
- Amount: 50 جنيه
- City: القاهرة
- Active: true

#### تكلفة شحن الإسكندرية:
- Amount: 75 جنيه
- City: الإسكندرية
- Active: true

#### تكلفة شحن الجيزة:
- Amount: 60 جنيه
- City: الجيزة
- Active: true

## ⚠️ ملاحظات مهمة

### 1. الصور:
- استخدم صور حقيقية بامتداد `.jpg` أو `.png`
- حجم الصورة الموصى به: أقل من 5MB
- للصور الإضافية: أقصى 6 صور

### 2. الـ Authorization:
- **Admin**: يمكنه الوصول لجميع الـ APIs
- **Data Entry**: يمكنه إنشاء وتحديث المنتجات والتصنيفات
- **User**: يمكنه إدارة الكارت والطلبات والمفضلة

### 3. الـ Validation:
- تأكد من صحة البيانات قبل الإرسال
- استخدم الأرقام للأسعار والكميات
- تأكد من صحة تنسيق البريد الإلكتروني

### 4. الـ Error Handling:
- تحقق من رسائل الخطأ في الـ response
- تأكد من وجود الـ required fields
- تحقق من صحة الـ IDs المستخدمة

## 🔄 سير العمل المقترح

1. **تسجيل دخول المدير** → الحصول على admin_token
2. **إنشاء تصنيف** → الحصول على category_id
3. **إنشاء تصنيف فرعي** → الحصول على subcategory_id
4. **إنشاء منتج** → الحصول على product_id
5. **إنشاء مخزون** → الحصول على stock_id
6. **تسجيل دخول المستخدم** → الحصول على user_token
7. **إضافة منتج للكارت** → اختبار وظائف الكارت
8. **إنشاء طلب** → اختبار نظام الطلبات

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من تشغيل الخادم على `localhost:3000`
2. تأكد من صحة الـ database connection
3. تحقق من الـ logs في console
4. تأكد من صحة الـ environment variables 
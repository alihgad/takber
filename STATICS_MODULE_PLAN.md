# خطة تطوير Statics Module للمتجر الإلكتروني

## نظرة عامة
إنشاء module جديد لعرض إحصائيات شاملة عن مبيعات المتجر بما يشمل المبيعات المالية، أعداد القطع المباعة، والمنتجات والفئات الأكثر مبيعاً.

## تحليل البيانات الموجودة

### جداول البيانات المستخدمة:
1. **Order Model**: يحتوي على:
   - `amount`: إجمالي قيمة الطلب
   - `cart`: مصفوفة تحتوي على المنتجات مع الكميات
   - `status`: حالة الطلب (pending, shipped, delivered, cancelled)
   - `createdAt`: تاريخ إنشاء الطلب
   - `userId`: معرف المستخدم

2. **Product Model**: يحتوي على:
   - `title`: اسم المنتج (عربي/إنجليزي)
   - `price`: السعر الأصلي
   - `finalPrice`: السعر النهائي بعد الخصم
   - `category`: معرف الفئة
   - `brand`: العلامة التجارية
   - `createdAt`: تاريخ الإنشاء

3. **Category Model**: يحتوي على:
   - `title`: اسم الفئة (عربي/إنجليزي)
   - `createdAt`: تاريخ الإنشاء

## الخطوات التفصيلية

### المرحلة الأولى: إعداد البنية الأساسية
1. **إنشاء مجلد statics في src/moduels/**
2. **إنشاء الملفات الأساسية:**
   - `statics.controller.js`
   - `statics.service.js`
   - `statics.schema.js`

### المرحلة الثانية: تحديد APIs المطلوبة

#### 1. إحصائيات المبيعات العامة
- **GET /statics/sales-summary**
  - إجمالي المبيعات (مالي) خلال فترة زمنية
  - إجمالي عدد القطع المباعة
  - عدد الطلبات المكتملة
  - متوسط قيمة الطلب

#### 2. إحصائيات الفئات
- **GET /statics/top-categories**
  - أفضل الفئات مبيعاً (بالمبلغ)
  - أفضل الفئات مبيعاً (بعدد القطع)
  - نسبة مبيعات كل فئة

#### 3. إحصائيات المنتجات
- **GET /statics/top-products**
  - أفضل المنتجات مبيعاً (بالمبلغ)
  - أفضل المنتجات مبيعاً (بعدد القطع)
  - المنتجات الأكثر طلباً

#### 4. إحصائيات زمنية
- **GET /statics/sales-timeline**
  - مبيعات يومية/أسبوعية/شهرية
  - اتجاهات المبيعات عبر الزمن

#### 5. إحصائيات العملاء
- **GET /statics/customer-insights**
  - عدد العملاء الجدد
  - العملاء الأكثر شراءً
  - متوسط إنفاق العميل

### المرحلة الثالثة: تطبيق Schema Validation
- **معاملات التصفية:**
  - `startDate`: تاريخ البداية
  - `endDate`: تاريخ النهاية
  - `status`: حالة الطلبات (delivered, shipped, etc.)
  - `limit`: عدد النتائج المعروضة
  - `category`: تصفية حسب الفئة

### المرحلة الرابعة: تطبيق Business Logic

#### خوارزميات الحسابات:
1. **المبيعات المالية:**
   ```javascript
   // إجمالي المبيعات = مجموع amount للطلبات المكتملة
   totalSales = Order.aggregate([
     { $match: { status: "delivered", createdAt: { $gte: startDate, $lte: endDate } } },
     { $group: { _id: null, total: { $sum: "$amount" } } }
   ])
   ```

2. **عدد القطع المباعة:**
   ```javascript
   // مجموع كميات المنتجات في جميع الطلبات المكتملة
   totalItems = Order.aggregate([
     { $match: { status: "delivered" } },
     { $unwind: "$cart" },
     { $group: { _id: null, total: { $sum: "$cart.quantity" } } }
   ])
   ```

3. **أفضل المنتجات:**
   ```javascript
   // تجميع المبيعات حسب المنتج
   topProducts = Order.aggregate([
     { $match: { status: "delivered" } },
     { $unwind: "$cart" },
     { $group: { 
       _id: "$cart.productId", 
       totalSales: { $sum: { $multiply: ["$cart.quantity", "$cart.price"] } },
       totalQuantity: { $sum: "$cart.quantity" }
     }},
     { $sort: { totalSales: -1 } },
     { $limit: 10 }
   ])
   ```

### المرحلة الخامسة: تحسين الأداء
1. **إضافة Indexes مناسبة:**
   - `createdAt` للفلترة الزمنية
   - `status` للفلترة حسب حالة الطلب
   - `cart.productId` للتجميع حسب المنتج

2. **استخدام Caching:**
   - حفظ النتائج المحسوبة لفترات زمنية محددة
   - تحديث البيانات كل ساعة أو يوم

### المرحلة السادسة: إضافة التوجيه (Routing)
- تحديث ملف الروتر الرئيسي لإضافة routes الجديدة
- إضافة middleware للمصادقة والترخيص

### المرحلة السابعة: الاختبار والتحسين
1. **اختبار APIs:**
   - اختبار كل endpoint بمعاملات مختلفة
   - التأكد من صحة الحسابات
   - اختبار الأداء مع بيانات كبيرة

2. **إنشاء Postman Collection:**
   - إضافة جميع الـ endpoints الجديدة
   - أمثلة على الاستخدام

## الجداول الزمنية المقترحة
- **المرحلة 1-2**: 30 دقيقة (إعداد البنية والتخطيط)
- **المرحلة 3**: 20 دقيقة (Schema validation)
- **المرحلة 4**: 60 دقيقة (Business logic والحسابات)
- **المرحلة 5**: 30 دقيقة (تحسين الأداء)
- **المرحلة 6**: 15 دقيقة (Routing)
- **المرحلة 7**: 30 دقيقة (اختبار)

**إجمالي الوقت المقدر: 3 ساعات**

## ملاحظات تقنية
- استخدام MongoDB Aggregation Framework للحسابات المعقدة
- تطبيق معايير الأمان الموجودة في المشروع
- اتباع نفس هيكل ملفات الـ modules الأخرى
- إضافة رسائل خطأ واضحة ومفيدة
- دعم التصفية حسب التواريخ والفئات
- إمكانية تصدير البيانات بصيغ مختلفة (JSON, CSV)

## APIs المطلوبة بالتفصيل

### 1. `/statics/sales-summary`
**المعاملات:**
- `startDate` (optional): تاريخ البداية
- `endDate` (optional): تاريخ النهاية
- `status` (optional): حالة الطلبات

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "totalSales": 15000,
    "totalOrders": 120,
    "totalItems": 350,
    "averageOrderValue": 125,
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    }
  }
}
```

### 2. `/statics/top-categories`
**المعاملات:**
- `limit` (default: 10): عدد الفئات المعروضة
- `sortBy` (default: "sales"): ترتيب حسب المبيعات أو الكمية

**الاستجابة:**
```json
{
  "success": true,
  "data": [
    {
      "categoryId": "64a1b2c3d4e5f6789",
      "categoryName": {
        "arabic": "الهواتف الذكية",
        "english": "Smartphones"
      },
      "totalSales": 5000,
      "totalQuantity": 45,
      "percentage": 33.3
    }
  ]
}
```

### 3. `/statics/top-products`
**المعاملات:**
- `limit` (default: 10)
- `categoryId` (optional): تصفية حسب الفئة
- `sortBy` (default: "sales")

**الاستجابة:**
```json
{
  "success": true,
  "data": [
    {
      "productId": "64a1b2c3d4e5f6789",
      "productTitle": {
        "arabic": "آيفون 15",
        "english": "iPhone 15"
      },
      "totalSales": 2500,
      "totalQuantity": 15,
      "category": "الهواتف الذكية"
    }
  ]
}
```

هذه الخطة شاملة وقابلة للتنفيذ. هل تريد البدء في تطبيقها؟

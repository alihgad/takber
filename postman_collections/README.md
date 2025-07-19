# 📁 Postman Collections - Takbeer API

تم تقسيم Postman Collection إلى ملفات منفصلة لكل module لتسهيل التنظيم والاستخدام.

## 📋 الملفات المتاحة:

### 🔐 **Authentication_Collection.json**
- تسجيل دخول المستخدمين (Admin, Data Entry, User)
- إنشاء مستخدم جديد (للمدير فقط)
- **عدد الـ APIs**: 5

### 📂 **Categories_Collection.json**
- إدارة التصنيفات (عرض، إنشاء، تحديث، حذف)
- للمدير ومدخل البيانات (الحذف للمدير فقط)
- **عدد الـ APIs**: 5

### 📁 **Subcategories_Collection.json**
- إدارة التصنيفات الفرعية (عرض، إنشاء، تحديث، حذف)
- للمدير ومدخل البيانات (الحذف للمدير فقط)
- **عدد الـ APIs**: 6

### 🛍️ **Products_Collection.json**
- إدارة المنتجات (عرض، إنشاء، تحديث، حذف)
- للمدير ومدخل البيانات (الحذف للمدير فقط)
- **عدد الـ APIs**: 8

### 📦 **Stock_Collection.json**
- إدارة المخزون (عرض، إنشاء، تحديث، حذف)
- للمدير ومدخل البيانات (الحذف للمدير فقط)
- **عدد الـ APIs**: 5

### 🛒 **Cart_Collection.json**
- إدارة الكارت للمستخدمين
- **عدد الـ APIs**: 5

### ❤️ **Wishlist_Collection.json**
- إدارة المفضلة للمستخدمين
- **عدد الـ APIs**: 3

### 📋 **Orders_Collection.json**
- إدارة الطلبات (عرض للمدير، إنشاء للمستخدمين)
- حساب مصاريف الشحن تلقائياً حسب المدينة
- **عدد الـ APIs**: 6

### 🎫 **Coupons_Collection.json**
- إدارة الكوبونات (للمدير فقط)
- **عدد الـ APIs**: 4

### 🚚 **ShippingAmount_Collection.json**
- إدارة تكاليف الشحن (للمدير فقط)
- **عدد الـ APIs**: 6

## 🚀 كيفية الاستخدام:

### 1. استيراد Collections:
```
Postman → Import → اختر الملفات المطلوبة
```

### 2. إنشاء Environment:
```
Import → Takbeer_Environment.json
```

### 3. اختيار Environment:
```
Environment dropdown → "Takbeer Local"
```

## 📊 ترتيب الاستخدام المقترح:

### **للمدير (Admin)**:
1. **Authentication** → تسجيل دخول المدير
2. **Categories** → إنشاء التصنيفات
3. **Subcategories** → إنشاء التصنيفات الفرعية
4. **Products** → إنشاء المنتجات
5. **Stock** → إدارة المخزون
6. **Coupons** → إدارة الكوبونات
7. **ShippingAmount** → إدارة تكاليف الشحن
8. **Orders** → إدارة الطلبات

### **لمدخل البيانات (Data Entry)**:
1. **Authentication** → تسجيل دخول مدخل البيانات
2. **Categories** → إنشاء وتحديث التصنيفات
3. **Subcategories** → إنشاء وتحديث التصنيفات الفرعية
4. **Products** → إنشاء وتحديث المنتجات
5. **Stock** → إدارة المخزون

### **للمستخدم العادي (User)**:
1. **Authentication** → تسجيل دخول المستخدم
2. **Cart** → إدارة الكارت
3. **Wishlist** → إدارة المفضلة
4. **Orders** → إنشاء ومتابعة الطلبات

## 🔑 المتغيرات المطلوبة:

### **متغيرات الـ Tokens**:
- `admin_token` - للمدير
- `user_token` - للمستخدم العادي
- `data_entry_token` - لمدخل البيانات

### **متغيرات الـ IDs**:
- `category_id` - معرف التصنيف
- `subcategory_id` - معرف التصنيف الفرعي
- `product_id` - معرف المنتج
- `stock_id` - معرف المخزون
- `cart_item_id` - معرف عنصر الكارت
- `wishlist_item_id` - معرف عنصر المفضلة
- `order_id` - معرف الطلب
- `coupon_id` - معرف الكوبون
- `shipping_amount_id` - معرف تكلفة الشحن

## ⚡ نصائح سريعة:

### **تحديث الـ Tokens تلقائياً**:
أضف هذا الكود في `Tests` tab لكل request تسجيل دخول:

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("admin_token", response.token);
}
```

### **تحديث الـ IDs تلقائياً**:
أضف هذا الكود في `Tests` tab لكل request إنشاء:

```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("category_id", response.category._id);
}
```

## 📞 الدعم:

إذا واجهت أي مشاكل:
1. تأكد من تشغيل الخادم على `localhost:3000`
2. تحقق من صحة الـ Environment variables
3. تأكد من صحة الـ Authorization tokens
4. راجع الـ logs في console

## 🎯 المميزات:

- ✅ **تنظيم أفضل**: كل module في ملف منفصل
- ✅ **سهولة الاستخدام**: يمكن استيراد module واحد فقط
- ✅ **مرونة**: يمكن تعديل كل collection بشكل مستقل
- ✅ **توثيق كامل**: كل API موثقة بالتفصيل
- ✅ **بيانات تجريبية**: جاهزة للاستخدام الفوري 
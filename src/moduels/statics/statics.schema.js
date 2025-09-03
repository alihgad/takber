import Joi from "joi"

// Schema للحصول على إحصائيات المبيعات العامة
export const salesSummarySchema = {
    startDate: Joi.date().optional().messages({
        "date.base": "Start date must be a valid date"
    }),
    endDate: Joi.date().optional().messages({
        "date.base": "End date must be a valid date"
    }),
    status: Joi.string().valid("pending", "shipped", "delivered", "cancelled").optional().messages({
        "any.only": "Status must be one of: pending, shipped, delivered, cancelled"
    })
}

// Schema للحصول على أفضل الفئات
export const topCategoriesSchema = {
    limit: Joi.number().integer().min(1).max(50).default(10).optional().messages({
        "number.base": "Limit must be a number",
        "number.integer": "Limit must be an integer",
        "number.min": "Limit must be at least 1",
        "number.max": "Limit cannot exceed 50"
    }),
    sortBy: Joi.string().valid("sales", "quantity").default("sales").optional().messages({
        "any.only": "Sort by must be either 'sales' or 'quantity'"
    }),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional()
}

// Schema للحصول على أفضل المنتجات
export const topProductsSchema = {
    limit: Joi.number().integer().min(1).max(50).default(10).optional().messages({
        "number.base": "Limit must be a number",
        "number.integer": "Limit must be an integer",
        "number.min": "Limit must be at least 1",
        "number.max": "Limit cannot exceed 50"
    }),
    categoryId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional().messages({
        "string.pattern.base": "Category ID must be a valid MongoDB ObjectId"
    }),
    sortBy: Joi.string().valid("sales", "quantity").default("sales").optional().messages({
        "any.only": "Sort by must be either 'sales' or 'quantity'"
    }),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional()
}

// Schema للحصول على إحصائيات زمنية
export const salesTimelineSchema = {
    query:Joi.object({
        period: Joi.string().valid("daily", "weekly", "monthly").default("daily").optional().messages({
            "any.only": "Period must be one of: daily, weekly, monthly"
        }),
        startDate: Joi.string().required().messages({
            "any.required": "Start date is required",
            "date.base": "Start date must be a valid date"
        }),
        endDate: Joi.string().required().messages({
            "any.required": "End date is required",
            "date.base": "End date must be a valid date"
        }),
        status: Joi.string().valid("pending", "shipped", "delivered", "cancelled").optional()
    })
}

// Schema للحصول على إحصائيات العملاء
export const customerInsightsSchema = {
    body:Joi.object({
        limit: Joi.number().integer().min(1).max(100).default(20).optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    minOrders: Joi.number().integer().min(1).default(1).optional().messages({
        "number.base": "Minimum orders must be a number",
        "number.integer": "Minimum orders must be an integer",
        "number.min": "Minimum orders must be at least 1"
    })
    })
}

// Schema للحصول على إحصائيات شاملة
export const dashboardStatsSchema = {
    period: Joi.string().valid("today", "week", "month", "year", "all").default("month").optional().messages({
        "any.only": "Period must be one of: today, week, month, year, all"
    })
}

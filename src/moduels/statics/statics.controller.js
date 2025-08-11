import { Router } from "express";
import { asyncHandler } from "../../utils/ErrorHandling.js";
import * as staticsService from "./statics.service.js";
import validation from "../../middleware/validation.js";
import {
    salesSummarySchema,
    topCategoriesSchema,
    topProductsSchema,
    salesTimelineSchema,
    customerInsightsSchema,
    dashboardStatsSchema
} from "./statics.schema.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";

export const staticsRouter = Router()

/**
 * @api {get} /statics/sales-summary Get sales summary
 * @apiName GetSalesSummary
 * @apiGroup Statistics
 * @apiDescription Get comprehensive sales summary with total sales, orders, items, and average order value
 * @apiHeader {String} Authorization Bearer token for admin authentication
 * @apiQuery {Date} [startDate] Start date for filtering (YYYY-MM-DD)
 * @apiQuery {Date} [endDate] End date for filtering (YYYY-MM-DD)
 * @apiQuery {String} [status] Order status filter (pending/shipped/delivered/cancelled)
 * @apiSuccess {Number} totalSales Total sales amount
 * @apiSuccess {Number} netSales Net sales (excluding shipping)
 * @apiSuccess {Number} totalOrders Total number of orders
 * @apiSuccess {Number} totalItems Total items sold
 * @apiSuccess {Number} averageOrderValue Average order value
 */
staticsRouter.get("/sales-summary", 
    validation(salesSummarySchema), 
    authentication, 
    authorization(["admin"]), 
    asyncHandler(staticsService.getSalesSummary)
)

/**
 * @api {get} /statics/top-categories Get top performing categories
 * @apiName GetTopCategories
 * @apiGroup Statistics
 * @apiDescription Get top performing categories by sales or quantity
 * @apiHeader {String} Authorization Bearer token for admin authentication
 * @apiQuery {Number} [limit=10] Number of categories to return (1-50)
 * @apiQuery {String} [sortBy=sales] Sort by 'sales' or 'quantity'
 * @apiQuery {Date} [startDate] Start date for filtering
 * @apiQuery {Date} [endDate] End date for filtering
 * @apiSuccess {Array} categories Array of top categories with sales data
 * @apiSuccess {String} categories[].categoryName Category name (Arabic/English)
 * @apiSuccess {Number} categories[].totalSales Total sales for category
 * @apiSuccess {Number} categories[].totalQuantity Total quantity sold
 * @apiSuccess {Number} categories[].salesPercentage Percentage of total sales
 */
staticsRouter.get("/top-categories", 
    validation(topCategoriesSchema), 
    authentication, 
    authorization(["admin"]), 
    asyncHandler(staticsService.getTopCategories)
)

/**
 * @api {get} /statics/top-products Get top performing products
 * @apiName GetTopProducts
 * @apiGroup Statistics
 * @apiDescription Get top performing products by sales or quantity
 * @apiHeader {String} Authorization Bearer token for admin authentication
 * @apiQuery {Number} [limit=10] Number of products to return (1-50)
 * @apiQuery {String} [categoryId] Filter by specific category ID
 * @apiQuery {String} [sortBy=sales] Sort by 'sales' or 'quantity'
 * @apiQuery {Date} [startDate] Start date for filtering
 * @apiQuery {Date} [endDate] End date for filtering
 * @apiSuccess {Array} products Array of top products with sales data
 * @apiSuccess {String} products[].productTitle Product title (Arabic/English)
 * @apiSuccess {Number} products[].totalSales Total sales for product
 * @apiSuccess {Number} products[].totalQuantity Total quantity sold
 * @apiSuccess {String} products[].categoryName Product category name
 */
staticsRouter.get("/top-products", 
    validation(topProductsSchema), 
    authentication, 
    authorization(["admin"]), 
    asyncHandler(staticsService.getTopProducts)
)

/**
 * @api {get} /statics/sales-timeline Get sales timeline data
 * @apiName GetSalesTimeline
 * @apiGroup Statistics
 * @apiDescription Get sales data over time (daily/weekly/monthly)
 * @apiHeader {String} Authorization Bearer token for admin authentication
 * @apiQuery {String} [period=daily] Time period: 'daily', 'weekly', or 'monthly'
 * @apiQuery {Date} startDate Start date (required)
 * @apiQuery {Date} endDate End date (required)
 * @apiQuery {String} [status] Order status filter
 * @apiSuccess {Array} timeline Array of sales data points over time
 * @apiSuccess {String} timeline[].period Time period label
 * @apiSuccess {Number} timeline[].totalSales Sales for this period
 * @apiSuccess {Number} timeline[].totalOrders Orders for this period
 * @apiSuccess {Number} timeline[].growthRate Growth rate compared to previous period
 */
staticsRouter.get("/sales-timeline", 
    validation(salesTimelineSchema), 
    authentication, 
    authorization(["admin"]), 
    asyncHandler(staticsService.getSalesTimeline)
)

/**
 * @api {get} /statics/customer-insights Get customer insights
 * @apiName GetCustomerInsights
 * @apiGroup Statistics
 * @apiDescription Get insights about customer behavior and top customers
 * @apiHeader {String} Authorization Bearer token for admin authentication
 * @apiQuery {Number} [limit=20] Number of top customers to return (1-100)
 * @apiQuery {Date} [startDate] Start date for filtering
 * @apiQuery {Date} [endDate] End date for filtering
 * @apiQuery {Number} [minOrders=1] Minimum number of orders for inclusion
 * @apiSuccess {Array} customers Array of top customers
 * @apiSuccess {String} customers[].customerName Customer name
 * @apiSuccess {Number} customers[].totalSpent Total amount spent
 * @apiSuccess {Number} customers[].totalOrders Total number of orders
 * @apiSuccess {Number} customers[].averageOrderValue Average order value
 * @apiSuccess {Object} summary Customer summary statistics
 */
staticsRouter.get("/customer-insights", 
    validation(customerInsightsSchema), 
    authentication, 
    authorization(["admin"]), 
    asyncHandler(staticsService.getCustomerInsights)
)

/**
 * @api {get} /statics/dashboard Get dashboard statistics
 * @apiName GetDashboardStats
 * @apiGroup Statistics
 * @apiDescription Get comprehensive dashboard statistics for overview
 * @apiHeader {String} Authorization Bearer token for admin authentication
 * @apiQuery {String} [period=month] Time period: 'today', 'week', 'month', 'year', or 'all'
 * @apiSuccess {Object} sales Sales statistics
 * @apiSuccess {Object} orders Order statistics by status
 * @apiSuccess {Object} inventory Inventory statistics
 * @apiSuccess {Object} customers Customer statistics
 */
staticsRouter.get("/dashboard", 
    validation(dashboardStatsSchema), 
    authentication, 
    authorization(["admin"]), 
    asyncHandler(staticsService.getDashboardStats)
)

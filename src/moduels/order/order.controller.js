import { Router } from "express";
import { asyncHandler } from "../../utils/ErrorHandling.js";
import * as os from "./order.service.js";
import validation from "../../middleware/validation.js";
import { 
    createOrderSchema, 
    updateOrderStatusSchema, 
    getOrderSchema, 
    getUserOrdersSchema, 
    getAllOrdersSchema,
    cancelOrderSchema,
    getTotalRevenueSchema,
    getCategorySalesSchema
} from "./order.schema.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";

export let orderRouter = Router()

/**
 * @api {post} /order Create new order from cart
 * @apiName CreateOrder
 * @apiGroup Orders
 * @apiDescription Create a new order from user's cart with shipping details and optional coupon
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiBody {Array} address Array of shipping addresses
 * @apiBody {Array} phoneNumbers Array of phone numbers (Egyptian format)
 * @apiBody {String} [couponId] Optional coupon ID for discount
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} order Created order details with populated product and cart information
 * @apiError {String} message Error message if cart is empty or stock insufficient
 */
orderRouter.post("/", validation(createOrderSchema), authentication, asyncHandler(os.createOrder))

/**
 * @api {get} /order/user Get user's orders
 * @apiName GetUserOrders
 * @apiGroup Orders
 * @apiDescription Retrieve all orders for the authenticated user
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiSuccess {Array} orders Array of user's orders with populated product details
 * @apiSuccess {String} orders[].status Order status (pending/shipped/delivered/cancelled)
 * @apiSuccess {Number} orders[].amount Order total amount
 * @apiSuccess {Array} orders[].products Array of products in the order
 */
orderRouter.get("/user", validation(getUserOrdersSchema), authentication, asyncHandler(os.getUserOrders))

/**
 * @api {get} /order/:orderId Get specific order
 * @apiName GetOrder
 * @apiGroup Orders
 * @apiDescription Retrieve details of a specific order by ID
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} orderId Order unique identifier
 * @apiSuccess {Object} order Order details with populated product, cart, and coupon information
 * @apiError {String} message Error message if order not found
 */
orderRouter.get("/:orderId", validation(getOrderSchema), authentication, asyncHandler(os.getOrder))

/**
 * @api {delete} /order/:orderId/cancel Cancel order
 * @apiName CancelOrder
 * @apiGroup Orders
 * @apiDescription Cancel a pending order and restore stock quantities
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} orderId Order unique identifier
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} order Updated order details
 * @apiError {String} message Error message if order cannot be cancelled
 */
orderRouter.delete("/:orderId/cancel", validation(cancelOrderSchema), authentication, asyncHandler(os.cancelOrder))

// Admin routes

/**
 * @api {get} /order Get all orders (Admin)
 * @apiName GetAllOrders
 * @apiGroup Orders
 * @apiDescription Retrieve all orders with pagination and filtering (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiQuery {Number} [page=1] Page number for pagination
 * @apiQuery {Number} [limit=10] Number of orders per page
 * @apiQuery {String} [filter] Filter by order status
 * @apiQuery {String} [from] Filter orders from date (YYYY-MM-DD)
 * @apiQuery {String} [to] Filter orders to date (YYYY-MM-DD)
 * @apiSuccess {Array} orders Array of orders with populated user and product details
 * @apiSuccess {Number} total Total revenue of returned orders
 * @apiSuccess {Number} itemCount Total number of items in returned orders
 */
orderRouter.get("/", validation(getAllOrdersSchema), authentication, authorization(['admin']), asyncHandler(os.getAllOrders))

/**
 * @api {put} /order/:orderId/status Update order status (Admin)
 * @apiName UpdateOrderStatus
 * @apiGroup Orders
 * @apiDescription Update the status of an order (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiParam {String} orderId Order unique identifier
 * @apiBody {String} status New order status (pending/shipped/delivered)
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} order Updated order details
 * @apiError {String} message Error message if order not found
 */
orderRouter.put("/:orderId/status", validation(updateOrderStatusSchema), authentication, authorization(['admin']), asyncHandler(os.updateOrderStatus))

/**
 * @api {get} /order/stats Get order statistics (Admin)
 * @apiName GetOrderStats
 * @apiGroup Orders
 * @apiDescription Get comprehensive order statistics (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiSuccess {Object} stats Order statistics
 * @apiSuccess {Number} stats.totalOrders Total number of orders
 * @apiSuccess {Number} stats.pendingOrders Number of pending orders
 * @apiSuccess {Number} stats.shippedOrders Number of shipped orders
 * @apiSuccess {Number} stats.deliveredOrders Number of delivered orders
 * @apiSuccess {Number} stats.cancelledOrders Number of cancelled orders
 * @apiSuccess {Number} stats.totalRevenue Total revenue from delivered orders
 */
orderRouter.get("/stats", validation(getAllOrdersSchema), authentication, authorization(['admin']), asyncHandler(os.getOrderStats))

/**
 * @api {get} /order/revenue/total Get total revenue (Admin)
 * @apiName GetTotalRevenue
 * @apiGroup Orders
 * @apiDescription Get total revenue with filtering options (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiQuery {String} [status] Filter by order status (default: delivered,shipped)
 * @apiQuery {String} [from] Filter revenue from date (YYYY-MM-DD)
 * @apiQuery {String} [to] Filter revenue to date (YYYY-MM-DD)
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} revenue Revenue statistics
 * @apiSuccess {Number} revenue.totalRevenue Total revenue amount
 * @apiSuccess {Number} revenue.totalOrders Number of orders
 * @apiSuccess {Number} revenue.totalDiscount Total discount applied
 * @apiSuccess {String} revenue.averageOrderValue Average order value
 * @apiSuccess {Object} revenue.filters Applied filters
 */
orderRouter.get("/revenue/total", validation(getTotalRevenueSchema), authentication, authorization(['admin']), asyncHandler(os.getTotalRevenue))

/**
 * @api {get} /order/revenue/categories Get category sales statistics (Admin)
 * @apiName GetCategorySales
 * @apiGroup Orders
 * @apiDescription Get detailed sales statistics grouped by category (Admin only)
 * @apiHeader {String} Authorization Bearer token for authentication
 * @apiQuery {String} [status] Filter by order status (default: delivered,shipped)
 * @apiQuery {String} [from] Filter sales from date (YYYY-MM-DD)
 * @apiQuery {String} [to] Filter sales to date (YYYY-MM-DD)
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} filters Applied filters
 * @apiSuccess {Object} overallStats Overall statistics
 * @apiSuccess {Number} overallStats.totalRevenue Total revenue across all categories
 * @apiSuccess {Number} overallStats.totalItems Total items sold
 * @apiSuccess {Number} overallStats.totalCategories Number of categories with sales
 * @apiSuccess {String} overallStats.averageRevenuePerCategory Average revenue per category
 * @apiSuccess {Array} categories Array of category sales data
 * @apiSuccess {String} categories[].categoryName Category name
 * @apiSuccess {Number} categories[].totalRevenue Category total revenue
 * @apiSuccess {Number} categories[].totalItems Category total items sold
 * @apiSuccess {Number} categories[].orderCount Number of orders in category
 * @apiSuccess {String} categories[].averageOrderValue Average order value in category
 * @apiSuccess {Array} categories[].products Array of products in category with sales data
 */
orderRouter.get("/revenue/categories", validation(getCategorySalesSchema), authentication, authorization(['admin']), asyncHandler(os.getCategorySales)) 
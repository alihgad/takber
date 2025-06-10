import productRouter from "./moduels/product/product.controller.js"
import { userRouter } from "./moduels/user/user.controller.js"
import categoryRouter  from "./moduels/category/category.controller.js"
import stockRouter from "./moduels/stock/stock.controller.js"
import couponRouter from "./moduels/coupon/coupon.controller.js"

export default (app)=>{


    app.use("/user" , userRouter)
    app.use("/product" , productRouter)
    app.use("/category" , categoryRouter)
    app.use("/stock" , stockRouter)
    app.use("/coupon" , couponRouter)
}
import mongoose from "mongoose";



let orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    products: [{
        prodectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    amount: {
        type: Number,
        required: true
    },
    address: [{
        type: String,
    }],
    phoneNumbers: [{
        type: String,
        regex: /^01[0125][0-9]{8}$/
    }],
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "shipped", "delivered"]
    },
    proccesd_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    couponId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
        default: null
    },
    discount:{
        type: Number,
        default: 0
    },
    cartId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        default: null
    },
    cart:[
        {
            prodectId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            stockId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Stock",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]

},{
    timestamps: true
})


export default mongoose.model("Order", orderSchema)
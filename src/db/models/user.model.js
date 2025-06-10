import mongoose from "mongoose";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        min:3,
        max:10
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min:6,
        max:20
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    Verfied: {
        type: Boolean,
        default: false
    },
    phoneNumbers:[
        {
            type: String,
            regex: /^01[0125][0-9]{8}$/
        }
    ],
    address: {
        type: String,
        default: ""
    },
    usedCoupons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon"
        }
    ]
    

}, { timestamps: true } )


userSchema.pre("save", function (next) {
    try {
      this.password = bcrypt.hashSync(this.password , +process.env.SALT )
      next();
    } catch (error) {
      next(error);
    }
  });
  

export default mongoose.model("User", userSchema)
import userModel from "../db/models/user.model.js";
import { asyncHandler } from "../utils/ErrorHandling.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const authentication= asyncHandler(
    
    async(req,res,next)=>{
            
        const {authorization}=req.headers
        
        if(!authorization){
            return next(new Error('Token not found',{cause:401}))
        }

     let x = jwt.verify(authorization,process.env.SECRET_KEY )

    
        const user= await userModel.findById({_id:x.id})
        if(!user){
            return next(new Error('User Not Found',{cause:404})) 
        }
      
        req.user=user
        next()
     }
)

export default authentication
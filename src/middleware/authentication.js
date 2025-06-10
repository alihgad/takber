import userModel from "../db/models/user.model.js";
import { asyncHandler } from "../utils/ErrorHandling.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const authentication= asyncHandler(
    
    async(req,res,next)=>{
            
        const {token}=req.headers
        

       
        if(!token){
            return res.status(401).json({message:"Token not found"})

        }

     let x = jwt.verify(token,process.env.SECRET_KEY )

    
        const user= await userModel.findById({_id:x.id})
        if(!user){
            return next(new Error('User Not Found',{cause:404})) 
        }
      
        req.user=user
        next()
     }
)

export default authentication
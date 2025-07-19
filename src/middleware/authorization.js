import { asyncHandler } from "../utils/ErrorHandling.js"

export const roleOptions={
    dataEntry:'dataEntry',
    admin:'admin'
}

const authorization=(accessRoles=null)=>{
    return asyncHandler(
         async(req,res,next)=>{
            // إذا لم يتم تمرير رول (null أو undefined)، يكون الـ API مفتوح للجميع
            if(!accessRoles || accessRoles.length === 0){
                return next()
            }
            
            // التحقق من وجود المستخدم
            if(!req.user){
                return res.status(401).json({message:"Unauthorized: User not authenticated."})
            }
            
            // التحقق من الرول
            if(!accessRoles.includes(req.user.role)){
                return res.status(403).json({message:"Access denied: You do not have the required permissions."})
            }
            next()
         }
       )
    }
export default authorization

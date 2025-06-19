import { asyncHandler } from "../utils/ErrorHandling.js"

export const roleOptions={
    dataEntry:'dataEntry',
    admin:'admin'
}

const authorization=(accessRoles=[])=>{
    return asyncHandler(
         async(req,res,next)=>{
            if(!accessRoles.includes(req.user.role)){
                return res.status(403).json({message:"Access denied: You do not have the required permissions."})
            }
            next()
         }
       )
    }
export default authorization

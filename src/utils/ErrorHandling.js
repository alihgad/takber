
import { v2 as cloudinary } from 'cloudinary';


export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
};



export const globalErrorHandling = (err, req, res, next) => {
  res
    .status(err["cause"] || 500)
    .json({ message: err.message, stack: err.stack });
  next()

};

// export const delteIdFromCopoun = async (req, res, next)=>{
//     if(req.body.coupon){

//         await couponModel.findByIdAndUpdate(req.body.coupon._id , {$pull:{usedBy:req.user._id}})
//     }

//     next()
// }


export const deleteFolder = async (req, res, next) => {
  if (req.image) {
    console.log("delete from cloudinary")
    if (req.image.public_id) {
      await cloudinary.uploader.destroy(req.image.public_id)
    } 
  }

  if (req.folder) {
    await cloudinary.api.delete_resources_by_prefix(req.folder)
    await cloudinary.api.delete_folder(req.folder)
  }


  next()
}

export const deleteFromDB = async (req, res, next) => {

  if (req.data) {
    console.log("delete from DB")

    await req.data.model.findByIdAndDelete(req.data.id)
  }
  return
}   

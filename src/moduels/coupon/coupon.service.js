import couponModel from "../../db/models/coupon.model.js"

export const createCoupon = async (req, res, next) => {
    let {expireDate , discount , code} = req.body

    expireDate = new Date(expireDate).toLocaleDateString()

    if(expireDate < new Date().toLocaleDateString()){
        return next(new Error('expire date must be greater than today', { cause: 400 }))
    }

    

    let coupon = await couponModel.create({
        code,
        discount,
        expireDate,
        createdBy: req.user._id,
    })

    return res.status(201).json({ message: "done", coupon })
}

export const updateCoupon = async (req, res, next) => {

    let { discount, expireDate } = req.body

    expireDate = new Date(expireDate).toLocaleDateString()

    if(expireDate < new Date().toLocaleDateString()){
        return next(new Error('expire date must be greater than today', { cause: 400 }))
    }


    let coupon = await couponModel.findOne({ _id: req.params.id })

    if (!coupon) {
        return next(new Error('coupon not found', { cause: 404 }))
    }


    coupon.discount = discount || coupon.discount
    coupon.expireDate = expireDate || coupon.expireDate
    
    coupon.save()
    
    return res.status(201).json({ message: "done", coupon })
}


export const deleteCoupon = async (req, res, next) => {
    let coupon = await couponModel.findByIdAndDelete(req.params.id)
    if (!coupon) {
        return next(new Error('coupon not found', { cause: 404 }))
    }
    return res.status(200).json({ message: "done", coupon })
}

export const getCoupons = async (req, res, next) => {
    let coupons = await couponModel.find()
    if (!coupons) {
        return next(new Error('no coupons yet', { cause: 404 }))
    }
    return res.status(200).json({ message: "done", coupons })
}

export const getcoupon = async (req, res, next) => {
    let coupon = await couponModel.findById(req.body.coupounId)
    if (!coupon) {
        return next(new Error('no coupon', { cause: 404 }))
    }
    return res.status(200).json({ message: "done", coupon })
}
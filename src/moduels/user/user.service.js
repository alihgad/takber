import userModel from "../../db/models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendEmail } from "../../services/sendEmail.js"
import { emailTemplate } from "../../services/content.js"
import dotenv from "dotenv"
dotenv.config()
export let signUp = async (req, res) => {
    let { phoneNumbers, email, name } = req.body

    if (phoneNumbers) {
        for (let i = 0; i < phoneNumbers.length; i++) {
            let ifPhoneD = await userModel.findOne({ phoneNumbers: phoneNumbers[i] })
            if (ifPhoneD) {
                return res.status(401).json({ message: "phone number already exist" })
            }
        }
    }

    let ifEmailD = await userModel.findOne({ email })
    if (ifEmailD) {
        return res.status(401).json({ message: "email already exist" })
    }

    let user = await userModel.create(req.body)

    let token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" })

    let x = await sendEmail(
        email,
        "Takbeer Email Verification",
        emailTemplate("Takbeer Email Verification", name, `
            <p>Welcome to <b>Takbeer</b></p>
            <p>Please verify your email</p>
           <a href="${req.protocol}://${req.headers.host}/user/verify/${token}">Click here </a>
          `)
    );

    if (!x) {
        return res.status(400).json({ message: "Email Not Sent" })
    }




    return res.status(201).json(user)
}
export let login = async (req, res, next) => {
    let user = await userModel.findOne({ email: req.body.email })

    if (!user) {
        return res.status(404).json({ message: "User Not Found" })
    }

    if (!user.Verfied) {
        return res.status(401).json({ message: "Email Not Verified" })
    }

    let isCorrect = await  bcrypt.compare(req.body.password, user.password)



    if (!isCorrect) {
        return res.status(401).json({ message: "Incorrect cradintels" })
    }


    let token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" })

    return res.status(201).json({ msg: "done", token })

}

export let verify = async (req, res, next) => {
    let token = req.params.token
    let user = await userModel.findOneAndUpdate({ _id: jwt.verify(token, process.env.SECRET_KEY).id  , Verfied: false} , { Verfied: true })
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    

    let x = await sendEmail(
        user.email,
        "Takbeer Email Verification",
        emailTemplate("Takbeer Email Verification", user.name, `
          <p>Welcome to <b>Takbeer</b></p>
          <p>Your email has been verified , you can login now </p>
        `)
    );

    if (!x) {
        return res.status(400).json({ message: "Email Not Sent" })
    }

    return res.status(201).json({ message: "done" })
}

export let update = async (req, res, next) => {
    let { name, phoneNumbers, address } = req.body
    let user = await userModel.findOne({ _id: req.user._id })

    name ? user.name = name : null
    phoneNumbers?.length > 0 ? user.phoneNumbers = phoneNumbers : null
    address?.length > 0 ? user.address = address : null
    await user.save()
    return res.status(201).json({ message: "done"  , user})
}

export let updatePassword = async (req, res, next) => {
    let { oldPassword, newPassword } = req.body
    if (oldPassword == newPassword) {
        return res.status(400).json({ message: "Password can't be the same" })
    }

    let user = await userModel.findOne({ _id: req.user._id })
    let isCorrect = await bcrypt.compare(oldPassword, user.password)
    if (!isCorrect) {
        return res.status(401).json({ message: "Incorrect Password" })
    }
    user.password = newPassword
    await user.save()
    return res.status(201).json({ message: "done" })
}

export let deleteUser = async (req, res, next) => {
    let user = await userModel.findOneAndDelete({ _id: req.user._id })
    return res.status(201).json({ message: "done" , user}) 
}

export let forgetPassword = async (req, res, next) => {
    let { email } = req.body
    let user = await userModel.findOne({ email })
    if (!user) {
        return res.status(404).json({ message: "User Not Found" })
    }
    let token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "5m" })
    let x = await sendEmail(
        email,
        "Takbeer Forget Password",
        emailTemplate("Takbeer Forget Password", user.name, `
          <p>Click on the link to reset your password</p>
          <a href="${req.protocol}://${req.headers.host}/user/reset-password/${token}">Click here </a>
        `)
    )

    console.log(x)
    

    x ? res.status(201).json({ message: "Email  Sent" }) : res.status(400).json({ message: "Email Not Sent" })
}

export let resetPassword = async (req, res, next) => {
    let{token} = req.params
    let { newPassword } = req.body
    let {id} = jwt.verify(token, process.env.SECRET_KEY)
    if(!id){
        return res.status(401).json({message:"wrong token"})
    }
    let user = await userModel.findOne({ _id: id })
    if(!user){
        return res.status(404).json({message:"User Not Found"})
    }
    user.password = newPassword
    await user.save()
    return res.status(201).json({ message: "done" })
}

export let profile = async (req, res, next) => {
    let users = await userModel.findOne({ _id: req.user._id }).select("-password -_id -__v")
    return res.status(201).json({ message: "done", users })
}
export let getAll = async (req, res, next) => {
    let users = await userModel.find().select("-password -_id -__v")
    return res.status(201).json({ message: "done", users })
}



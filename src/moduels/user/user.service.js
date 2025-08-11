import userModel from "../../db/models/user.model.js"
import { OAuth2Client } from "google-auth-library"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendEmail } from "../../services/sendEmail.js"
import { emailTemplate } from "../../services/content.js"
import dotenv from "dotenv"
dotenv.config()

const client = new OAuth2Client(process.env.client_id)

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




    return res.status(201).json(user)
}
export let login = async (req, res, next) => {
    let user = await userModel.findOne({ email: req.body.email })

    if (!user) {
        return res.status(404).json({ message: "User Not Found" })
    }

    if (user.provider !== "local") {
        return res.status(401).json({ message: "Please login with google" })
    }

    let isCorrect = bcrypt.compare(req.body.password, user.password)



    if (!isCorrect) {
        return res.status(401).json({ message: "Incorrect cradintels" })
    }


    let token = jwt.sign({ id: user._id }, process.env.SECRET_KEY)

    return res.status(201).json({ msg: "done", token })

}

export let googleLogin = async (req, res, next) => {
    const { idToken } = req.body;

    // Verify the ID token with Google's API
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.client_id,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // Check if user exists in the database
    let user = await userModel.findOne({ email });

    if (!user) {
        // If user does not exist, create a new user
        user = new userModel({ email, name, Verfied: true, provider: "google" });
        await user.save();
    }


    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

    return res.status(200).json({ msg: "Logged in successfully", token });
}


export let update = async (req, res, next) => {
    let { name, phoneNumbers, address } = req.body
    let user = await userModel.findOne({ _id: req.user._id })

    name ? user.name = name : null
    phoneNumbers?.length > 0 ? user.phoneNumbers = phoneNumbers : null
    address?.length > 0 ? user.address = address : null
    await user.save()
    return res.status(201).json({ message: "done", user })
}

export let updatePassword = async (req, res, next) => {
    let { oldPassword, newPassword } = req.body
    if (oldPassword == newPassword) {
        return res.status(400).json({ message: "Password can't be the same" })
    }

    let user = await userModel.findOne({ _id: req.user._id })
    let isCorrect = bcrypt.compare(oldPassword, user.password)
    if (!isCorrect) {
        return res.status(401).json({ message: "Incorrect Password" })
    }
    user.password = newPassword
    await user.save()
    return res.status(201).json({ message: "done" })
}

export let deleteUser = async (req, res, next) => {
    let user = await userModel.findOneAndDelete({ _id: req.user._id })
    return res.status(201).json({ message: "done", user })
}

export let deleteUserForAdmin = async (req, res, next) => {
    let { id } = req.params
    let user = await userModel.findOneAndDelete({ _id: id })
    if(!user){
        return res.status(404).json({ message: "User Not Found" })
    }
    return res.status(201).json({ message: "done", user })
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
    let { token } = req.params
    let { newPassword } = req.body
    let { id } = jwt.verify(token, process.env.SECRET_KEY)
    if (!id) {
        return res.status(401).json({ message: "wrong token" })
    }
    let user = await userModel.findOne({ _id: id })
    if (!user) {
        return res.status(404).json({ message: "User Not Found" })
    }
    user.password = newPassword
    await user.save()
    return res.status(201).json({ message: "done" })
}

export let profile = async (req, res, next) => {
    let users = await userModel.findOne({ _id: req.user._id })
    return res.status(201).json({ message: "done", users })
}
export let getAll = async (req, res, next) => {
    let { page, limit, search, role } = req.query
    let query = {}
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } }
        ]
    }
    if (role) {
        query.role = role
    }

    let skip = (page - 1) * limit
    let count = await userModel.countDocuments(query)
    let users = await userModel.find(query).skip(skip).limit(limit)
    let totalPages = Math.ceil(count / limit)
    let hasNextPage = page < totalPages
    let hasPreviousPage = page > 1
    let nextPage = hasNextPage ? page + 1 : null
    let previousPage = hasPreviousPage ? page - 1 : null
    return res.status(201).json({ message: "done", users , totalPages , hasNextPage , hasPreviousPage , nextPage , previousPage })
}

export let createUser = async (req, res, next) => {
    let { phoneNumbers, email, name, password, role } = req.body

    // التحقق من وجود البريد الإلكتروني
    if (!email) {
        return res.status(400).json({ message: "Email is required" })
    }

    // التحقق من عدم تكرار البريد الإلكتروني
    let ifEmailD = await userModel.findOne({ email })
    if (ifEmailD) {
        return res.status(400).json({ message: "Email already exists" })
    }

    // التحقق من وجود الاسم
    if (!name) {
        return res.status(400).json({ message: "Name is required" })
    }

    // التحقق من وجود كلمة المرور
    if (!password) {
        return res.status(400).json({ message: "Password is required" })
    }

    // التحقق من أرقام الهاتف إذا تم تمريرها
    if (phoneNumbers) {
        for (let i = 0; i < phoneNumbers.length; i++) {
            let ifPhoneD = await userModel.findOne({ phoneNumbers: phoneNumbers[i] })
            if (ifPhoneD) {
                return res.status(400).json({ message: "Phone number already exists" })
            }
        }
    }

    if (!role) {
        return res.status(400).json({ message: "Role is required" })
    }

    // إنشاء المستخدم الجديد
    let userData = {
        email,
        name,
        password,
        phoneNumbers: phoneNumbers || [],
        role: role,
        Verfied: true, // المستخدم الذي ينشئه المدير يكون مؤكد تلقائياً
        provider: 'local'
    }

    let user = await userModel.create(userData)

    // إرجاع بيانات المستخدم بدون كلمة المرور
    let userResponse = user.toObject()
    delete userResponse.password

    return res.status(201).json({
        message: "User created successfully",
        user: userResponse
    })
}

export let changePasswordForAdmin = async (req, res, next) => {
    let { id } = req.params
    let { newPassword, confirmPassword } = req.body
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Password and Confirm Password do not match" })
    }
    let user = await userModel.findOne({ _id: id })
    if (!user) {
        return res.status(404).json({ message: "User Not Found" })
    }
    user.password = newPassword
    await user.save()
}

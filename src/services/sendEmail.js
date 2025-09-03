import nodeMailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail=async (to,subject,html,attachments)=>{
  const transporter = nodeMailer.createTransport({
    host:"smtp.gmail.com",
    port: 587,
    secure: false,
    auth:{
      user:process.env.EMAIL_SENDER,
      pass:process.env.EMAIL_SENDER_PASS
    }
  })

 const info = await  transporter.sendMail({
  from:process.env.EMAIL_SENDER,
  to:to?to:"",
  subject:subject?subject:"",
  attachments:attachments?attachments:[],
  html:html?html:""
 })


 if(info.accepted.length){
  return true;
 }

 return false
}


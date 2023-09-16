const nodemailer = require("nodemailer");
const ErrorHandler = require("../utils/ErrorHandler");

exports.sendmail = (req, res, next, url) =>{
        const transport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            post: 465,
            auth:{
                user: process.env.MAIL_EMAIL_ADDRESS,
                pass:process.env.MAIL_PASSWORD,
            },
        });
        const mailOptions ={
            from: "ODOP Private Limited",
            to: req.body.email,
            subject: "Password Reset Link",
            html:`<h1>Click link blow to reset password</h1>
            <a href="${url}">Password Reset Link </a>`,
        };

        transport.sendMail(mailOptions,(err,info)=>{
            if(err){
                return next (new ErrorHandler(err,500));
            } else{
                console.log(info);
                
                return res.status(200).json({
                    message: "mail sent successfully",
                    url,
                })
            }
            
        });

}
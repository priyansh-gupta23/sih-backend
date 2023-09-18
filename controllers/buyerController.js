const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const Buyer = require("../models/buyerModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendtoken } = require("../utils/SendToken");
const { sendmail } = require("../utils/nodemailer");
const path = require("path");
const imagekit = require("../utils/imagekit").initImageKit();

exports.currentbuyer = catchAsyncErrors(async (req, res, next) => {
        const buyer = await Buyer.findById(req.id).exec();
        res.json({ buyer });
});

exports.homepage = catchAsyncErrors(async (req, res, next) => {
        res.json({ message: "Secure Homepage!" });

});

exports.buyersignup = catchAsyncErrors(async (req, res, next) => {
        const buyer = await new Buyer(req.body).save();
        sendtoken(buyer, 201, res);
});

exports.buyersignin = catchAsyncErrors(async (req, res, next) => {
        const buyer = await Buyer.findOne({ email: req.body.email })
                .select("+password")
                .exec();

        if (!buyer) return next(
                new ErrorHandler("User not found with this email address", 404))
        const isMatch = buyer.comparepassword(req.body.password);
        if (!isMatch) return next(new ErrorHandler("Wrong Credientials", 500));

        sendtoken(buyer, 200, res);
});

exports.buyersignout = catchAsyncErrors(async (req, res, next) => {
        res.clearCookie("token");
        res.json({ message: "Successfully signout" });
});

exports.buyerSendMail = catchAsyncErrors(async (req, res, next) => {
        const buyer = await Buyer.findOne({ email: req.body.email }).exec()
        if (!buyer)
                return next(
                        new ErrorHandler("User not found with this email address", 404)
                );
        const url = `${req.protocol}://${req.get("host")}/buyer/forget-link/${buyer._id}`;
        sendmail(req, res, next, url);
        buyer.resetPasswordToken = "1";
        await buyer.save();
        res.json({ buyer, url })
})

exports.buyerforgetlink = catchAsyncErrors(async (req, res, next) => {
        const buyer = await Buyer.findById(req.params.id).exec()
        if (!buyer)
                return next(
                        new ErrorHandler("User not found with this email address", 404)
                );

        if (buyer.resetPasswordToken == "1") {
                buyer.resetPasswordToken = "0";
                buyer.password = req.body.password;
                await buyer.save();
        }
        else {
                return next(
                        new ErrorHandler("Invalid Reset Password Link!! Please Try Again ", 500)
                )
        }

        res.status(200).json({
                message: "Password has been successfully changed"
        })
})

exports.buyerrestpassword = catchAsyncErrors(async (req, res, next) => {
        const buyer = await Buyer.findById(req.id).exec();
        buyer.password = req.body.password;
        await buyer.save();
        sendtoken(buyer, 201, res);

})

exports.buyerupdate = catchAsyncErrors(async (req, res, next) => {

        await Buyer.findByIdAndUpdate(req.params.id, req.body).exec();
        res.status(200).json({
                success: true,
                message: "Buyer Updated Successfully!",
        });
})

exports.buyeravatar = catchAsyncErrors(async (req, res, next) => {
        const buyer = await Buyer.findById(req.params.id).exec();
        const file = req.files.avatar;
        const modifiedFileName = `buyerproflie=${Date.now()}${path.extname(file.name)}`;

        if (buyer.avatar.fileId !== "") await imagekit.deleteFile(buyer.avatar.fileId)

        const { fileId, url } = await imagekit.upload({
                file: file.data, 
                fileName: modifiedFileName,
        })
        buyer.avatar = { fileId, url };
        await buyer.save()
        res.status(200).json({
                success: true,
                message: "Profile Updated",
        });
        
})


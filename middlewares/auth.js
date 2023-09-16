const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsyncErrors } = require("./catchAsyncErrors");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    if (req.cookies && req.cookies.token) {
        const { token } = req.cookies;
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        req.id =id;
        next();
    } else {
        return next(new ErrorHandler("Please login to access the resource",401))
    }
})
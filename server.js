require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();

// db connection
require("./models/database").connectDatabase();

//logger
const logger = require("morgan");
app.use(logger("tiny"));

//bodyparser 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//session and cookie
const session = require("express-session");
const cookieparser = require("cookie-parser");
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SECRET
}))

//routes
app.use(cookieparser())
app.use("/", require("./routes/buyerRoutes"));
    
//Error Handling
const ErrorHandler = require("./utils/ErrorHandler");
const { generatedErrors } = require("./middlewares/errors");
app.all( "*", (req, res, next) => {
    next(new ErrorHandler(`Requested URL Not Found ${req.url}`, 404))
});
app.use(generatedErrors);

app.listen(
    process.env.PORT,
    console.log(`Server is running on port ${process.env.PORT}`)
);
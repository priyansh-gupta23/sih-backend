const express = require("express");
const router =  express.Router();

const {
    homepage,
    currentbuyer,
    buyersignup,
    buyersignin,
    buyersignout,
    buyerSendMail,
    buyerforgetlink,
    buyerrestpassword,
    buyerupdate,
    buyeravatar,
} = require("../controllers/buyerController");
const { isAuthenticated } = require("../middlewares/auth");

//Get /
router.get("/",homepage);

//Post /
router.post("/buyer",isAuthenticated,currentbuyer);


// Post /buyer/signup
router.post("/buyer/signup",buyersignup);

// Post /buyer/signin
router.post("/buyer/signin",buyersignin);

// Get /buyer/signout
router.get("/buyer/signout",isAuthenticated,buyersignout);

//Post /buyer/send-mail
router.post("/buyer/send-mail",buyerSendMail);

//Get /buyer/forget-link/:buyerid
router.get("/buyer/forget-link/:id", buyerforgetlink)

//Post /buyer/reset-password/:buyerid
router.post("/buyer/reset-password/:id",isAuthenticated, buyerrestpassword)

//Post /buyer/uopdate/:buyerid
router.post("/buyer/update/:id",isAuthenticated, buyerupdate)

//Post /buyuer/avatar/:buyerid
router.post("/buyer/avatar/:id", isAuthenticated, buyeravatar)


module.exports = router;
 
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const buyerModel = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: [true, "First Name is required"],
            minLength: [4, "First name should be atleast 4 character long"],
        },

        lastname: {
            type: String,
            required: [true, "Last Name is required"],
            minLength: [4, "Last name should be atleast 4 character long"],
        },

        email: {
            type: String,
            unique: true,
            reqired: [true, "Email is required"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please fill a valid email address'
            ],

        },

        password: {
            type: String,
            select: false,
            maxlength: [15, "Password should not exceed more than 15 characters"],
            minlength: [6, "Password should not less than 6 characters"],
            //match:[]
        },

        resetPasswordToken: {
            type: String,
            default: "0"
        },

        gender: { type: String, enum: ["Male", "Female", "Others"] },

        contact: {
            type: String,
            required: [true, "Contact is required"],
            minLength: [10, "Contact should be atleast 10 character long"],
            maxLength: [10, "Contact must not be exceed 10 character long"],
        },

        
            AddressLine1: {
                type: String,
            },
            AddressLine2: {
                type: String,
            },
            cityName: {
                type: String,
                required: [true, "City name is required"],
                minLength: [3, "City should be atleast 3 character long"],
            },
            stateName: {
                type: String,
                required: [true, "State name is required"],
                minLength: [3, "State should be atleast 3 character long"],
            },
            postalCode:{
                type :String ,
                required:[true,"Postal code is required!!"],
                minLenght:[3,'postalcode should have minimum of four digits'],
            },
            countryName:{
                type:String,
                required:[true,"Country Name is required."]
            },
        

        avatar: {
            type: String
        },

    },
    { timestamps: true }
)

buyerModel.pre("save", function () {
    if (!this.isModified("password")) {
        return;
    }
    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
})

buyerModel.methods.comparepassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

buyerModel.methods.getjwttoken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}

const Buyer = mongoose.model("buyer", buyerModel)
module.exports = Buyer;
import mongoose , { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({

    Name : {
        type : String,
        required : true,
    },

    Mobile : {
        type : Number,
        required : true,
    },

    Gender : {
        type : String,
        enum : ["Male","Female"],
        required : true,
    },

    Email : {
        type : String,
        required : true,
    },
    
    password : {
        type : String,
        required : true,
    },

    bio : {
        type : String,
    },

    profilePicture : {
        type: String, 
        default: ""
    },

    refreshToken : {
        type : String,
    }

    },{timestamps : true});

userSchema.pre("save",async function () {
    if (!this.isModified("password")) {
       return ;
    }

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function(password) {
        return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign({
        _id : this._id,
        Email : this.Email, 
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY      
        }
)}

userSchema.methods.generateRefreshToken = async function() {
    return jwt.sign({
             _id : this._id,
        },
              process.env.REFRESH_TOKEN_SECRET,
        {
              expiresIn : process.env.REFRESH_TOKEN_EXPIRY
       }
    )
}

export const User = mongoose.model("User",userSchema);
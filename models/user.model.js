const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const validator=require('validator');
const userRoles = require('../utils/userRoles');
const userSchema=new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,'field must be a valid email address']
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:[userRoles.USER,userRoles.ADMIN,userRoles.MANAGER],
        default:userRoles.USER
    },
    avatar:{
        type:String,
        default:'uploads/profile.jpg',
    }
})
const userModel=mongoose.model('User',userSchema);
module.exports=userModel; 
const asyncWrapper = require("../middleware/asyncWrapper");
const user=require('../models/userModel');
const httpStatusText = require("../utils/httpStatusText");
const appError=require('../utils/appError');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const generateJwt=require('../utils/generateJwt');
const getAllUsers=asyncWrapper(
    async(req,res)=>{
        const query=req.query;
        const limit=query.limit||4;
        const page=query.page||1;
        const skip=(page-1)*limit;
        const allUsers=await user.find({},{"__v":false,password:false}).limit(limit).skip(skip);
        res.status(200).json({status:httpStatusText.SUCCESS,Users:{allUsers}});
    }
);
const getUserProfile=asyncWrapper(
    async(req,res,next)=>{
           const findUser=await user.findOne({id:req.body.id}) 
           if(!findUser)
           {
                const error=appError.create('This profile is not exist',400,httpStatusText.FAIL);
                return next(error);
           }
           res.status(200).json({status:httpStatusText.SUCCESS,Profile:{findUser}});
    }
)
const register=asyncWrapper(
    async(req,res,next)=>{
        // console.log(req.body);
        const{firstName,lastName,email,password,role,avatar}=req.body;
        const oldUser=await user.findOne({email:email});
        if(oldUser){
            const error=appError.create('User Already Exists',400,httpStatusText.FAIL);
            return next(error);
        }
        const hashedPassword=await bcrypt.hash(password,8)
        const newUser=new user({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            role,
            avatar:req.file.filename
        });
        const token=await generateJwt({email:newUser.email,id:newUser._id,role:newUser.role});
        newUser.token=token;
        await newUser.save();
        res.status(200).json({status:httpStatusText.SUCCESS,data:{user:newUser}});
    }
)
const login=asyncWrapper(
    async(req,res,next)=>{
        const {email,password}=req.body;
        if(!email && !password){
            const error=appError.create("Please Sign in first",400,httpStatusText.FAIL);
            return next(error);
        }
        const userExist=await user.findOne({email:email});
        if(!userExist)
        {
            const error=appError.create("User Not Found",400,httpStatusText.FAIL);
            return next(error);
        }
        const token=await generateJwt({email:userExist.email,id:userExist._id,role:userExist.role});
        const match=await bcrypt.compare(password,userExist.password)
        if(userExist && match){
            res.status(200).json({status:httpStatusText.SUCCESS,data:"User Logged in successfully",token});
        }
        else {
            const error=appError.create("Something wrong",400,httpStatusText.FAIL);  
            res.status(400).json({status:httpStatusText.SUCCESS,data:error});
        }
    }
)
module.exports={
    getAllUsers,
    getUserProfile,
    register,
    login
}
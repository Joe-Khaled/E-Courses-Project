const course=require('../models/courseModel');
const httpStatusText=require('../utils/httpStatusText');
const asyncWrapper=require('../middleware/asyncWrapper')
const appError=require('../utils/appError');
const Joi = require('joi');
const getCourses=asyncWrapper(
async(req,res)=>{
    const query=req.query;
    const limit=query.limit||10;
    const page=query.page || 1;
    const skip=(page-1)*limit;
    const courses=await course.find({},{"__v":false}).limit(limit).skip(skip);
    res.status(200).json({status:httpStatusText.SUCCESS,data:{courses}});
}
);
const schema=Joi.object({
    title:Joi.string().min(3).max(25).required(),
    description:Joi.string(),
    price:Joi.required()
})
const postCourse=asyncWrapper(
    async(req,res,next)=>{
        const newCourse=new course(req.body);
        const{error,value}=schema.validate(req.body);
        if(error)
        {
            return next(error);
        }
        const oldCourse=await course.findOne({title:req.body.title});
        if(oldCourse)
        {
            const error=appError.create('This course is already exist',400,httpStatusText.FAIL);
            return next(error);
        }
        await newCourse.save();
        res.status(200).json(newCourse);
});
const getCourse=asyncWrapper(
async(req,res,next)=>{
        const myCourse=await course.findById(req.params.id);
        if(!myCourse)
        {
            const error=appError.create("Not found a course",404,httpStatusText.FAIL);
            return next(error);
        }
        res.status(200).json({status:httpStatusText.SUCCESS,data:{myCourse}});
});
const updateCourse=asyncWrapper(async(req,res)=>{
        const recentCourse=await course.findByIdAndUpdate(req.params.id,req.body);
        res.status(200).json({status:httpStatusText.SUCCESS,data:{recentCourse}});
});
const deleteCourse=asyncWrapper(
    async(req,res)=>{
        // console.log(req.currentUser);
        await course.findByIdAndDelete(req.params.id);
        res.status(200).json({status:httpStatusText.SUCCESS,data:null});
});
const getCourseByTitle=asyncWrapper(
    async(req,res)=>{
        const query=req.query;
        const myCourse=await course.findOne({title:query.title});
        if(!myCourse)
        {
            const error=appError.create("This course is not available now",404,httpStatusText.FAIL);
            res.json(error);
        }
        res.status(200).json({status:httpStatusText.SUCCESS,data:{myCourse}});
    }
);
module.exports = {
    getCourses,
    getCourse,
    getCourseByTitle,
    postCourse,
    updateCourse,
    deleteCourse
};
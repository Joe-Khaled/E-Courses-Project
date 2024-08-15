const course=require('../models/courseSchema');
const httpStatusText=require('../utils/httpStatusText');
const asyncWrapper=require('../middleware/asyncWrapper')
const appError=require('../utils/appError');
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
const postCourse=asyncWrapper(
    async(req,res)=>{
        const newCourse=new course(req.body);
        // const valid=courseVal(req.body);
        // if(!valid){
        //     res.status(400).json({Error:"Your data is invalid data"});
        //     return;
        // }
        // newCourse.title=req.body.title;
        // newCourse.description=req.body.description;
        // newCourse.price=req.body.price;
        await newCourse.save();
        res.status(200).json(newCourse);
});
const getCourse=asyncWrapper(
async(req,res,next)=>{
        const myCourse=await course.findById(req.params.CourseId);
        if(!myCourse)
        {
            const error=appError.create("Not found a course",404,httpStatusText.FAIL);
            return next(error);
        }
        res.status(200).json({status:httpStatusText.SUCCESS,data:{myCourse}});
});
const updateCourse=asyncWrapper(async(req,res)=>{
        const recentCourse=await course.findByIdAndUpdate(req.params.courseId,req.body);
        res.status(200).json({status:httpStatusText.SUCCESS,data:{recentCourse}});
});
const deleteCourse=asyncWrapper(
    async(req,res)=>{
        // console.log(req.currentUser);
        const recentCourse=await course.findByIdAndDelete(req.params.courseId);
        res.status(200).json({status:httpStatusText.SUCCESS,data:null});
});
module.exports = {
    getCourses,
    postCourse,
    getCourse,
    updateCourse,
    deleteCourse
};
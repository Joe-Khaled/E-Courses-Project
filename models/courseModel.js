const mongoose=require('mongoose');
const schema=new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
})
const courseModel=mongoose.model('courseModel',schema);
module.exports=courseModel;
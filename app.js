require('dotenv').config();
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const httpStatusText=require('./utils/httpStatusText')
const courseRoutes=require('./routes/courseRoutes');
const userRoutes=require('./routes/userRoutes');
const cors=require('cors');
const path=require('path');
// const course=require('./models/courseSchema');
// const joi=require('joi');
const url=process.env.MONGO_URL;
mongoose.connect(url).then(()=>{
    console.log('Database connected successfully');
}).catch((err)=>{
    console.log("Your error is:",err);
})
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use(cors());
app.use(express.json());
app.use('/api/courses',courseRoutes);  
app.use('/api/users',userRoutes);
//for non-existing routes 

app.all('*',(req,res,next)=>{
    return res.status(404).json({status:httpStatusText.ERROR,message:"this resource is not available"});
})
app.use((err,req,res,next) => {
    res.status(err.statusCode||500).json({status:err.statusText||httpStatusText.ERROR, message:err.message,code:err.statusCode||500,data:null});
})
app.listen(process.env.PORT,()=>{
    console.log('Your app running on port 3001');
});
const express=require('express');
const router=express.Router();
const userController=require('../controllers/userControllers');
const verifyToken=require('../middleware/verifyToken');
const multer=require('multer');
const appError = require('../utils/appError');
const diskStorage=multer.diskStorage({
        destination:function(req,file,cb){
                cb(null,'uploads');
        },
        filename:function(req,file,cb){
                const ext=file.mimetype.split('/')[1];
                const filename=`user-${Date.now()}.${ext}`;
                cb(null,filename);
        }
})
const fileFilter=(req,file,cb)=>{
        const imageType=file.mimetype.split('/')[0];
        if(imageType==="image")
                cb(null,true);
        else 
                cb(appError.create("File must be an image file",401),false);
}
const upload=multer({storage:diskStorage,fileFilter});
router.route('/')
        .get(verifyToken,userController.getAllUsers);
router.route('/register')
        .post(upload.single('avatar'),userController.register)        
router.route('/login')
        .post(userController.login)        
router.route('/profile/:id')
        .get(userController.getUserProfile)

module.exports=router;
// const courseVal=joi.object({
//     title:joi.string()
//     .min(3)
//     .max(10)
//     .required(),
//     description:joi.string()
//     .min(10)
//     .required(),
//     price:joi.number()
//     .required()  
// })
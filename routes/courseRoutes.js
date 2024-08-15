const express=require('express');
const router=express.Router();
const controllers=require('../controllers/courseControllers');
const verifyToken = require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowedTo');
const userRoles = require('../utils/userRoles');
router.get('/api/getCourses',controllers.getCourses);

router.post('/api/postCourse',verifyToken,allowedTo(userRoles.MANAGER),controllers.postCourse);

router.get('/api/getCourse/:CourseId',controllers.getCourse);

router.put('/api/updateCourse/:courseId',controllers.updateCourse);

router.delete('/api/deleteCourse/:courseId',verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),controllers.deleteCourse);

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
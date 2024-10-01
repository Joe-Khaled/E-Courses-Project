const express=require('express');
const router=express.Router();
const controllers=require('../controllers/courseControllers');
const verifyToken = require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowedTo');
const userRoles = require('../utils/userRoles');
router.route('/')
        .get(controllers.getCourses);
        
router.route('/title')
      .get(controllers.getCourseByTitle);

router.route('/add')
      .post(verifyToken,allowedTo(userRoles.MANAGER),controllers.postCourse);

router.route('/:id')
      .get(controllers.getCourse);

router.route('/update/:id')
      .patch(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),controllers.updateCourse);

router.route('/delete/:id')
      .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),controllers.deleteCourse);

module.exports=router;
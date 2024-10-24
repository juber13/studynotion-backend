import { Router } from "express";
import { uploadCourse , getAllCourses , getInstructorCourses , makeCoursePublished , getCourseDetails } from "../controllers/course.controller.js";
const courseRouter = Router();

import { upload } from '../middlewares/multer.js'
import authenticate from "../middlewares/authenticate.js";

courseRouter.post("/uploadCourse", authenticate, upload.fields([{ name: 'thumbnail', maxCount: 1 },{ name: 'video', maxCount: 1 }]), uploadCourse);
courseRouter.get("/getCourse" , getAllCourses);
courseRouter.get("/getInstructorCourse", authenticate, getInstructorCourses);
courseRouter.patch("/:courseId", authenticate, makeCoursePublished);    
courseRouter.get("/:id", authenticate, getCourseDetails);    

export default courseRouter;
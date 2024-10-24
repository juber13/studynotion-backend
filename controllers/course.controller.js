import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadImage from "../utils/cloudinary.js";

const uploadCourse = asyncHandler(async (req, res) => {
  const { courseName, description, coursePrice, courseDuration } = req.body;
  
  if ([courseName,description,coursePrice,courseDuration].some((field) => !field)) {
    throw new ApiError(400, "All fields are required");
  }
  // Check if files are uploaded
  if (!req.files || req.files.length < 2) {
    throw new ApiError(400, "Both thumbnail and video are required");
  }

   const uploadBy = await User.findById(req.user._id);
   const {name} = uploadBy;

  // Extracting paths for thumbnail and video
  const thumbnailPath = req.files.thumbnail[0].path; // Assuming thumbnail is uploaded first
  const videoPath = req.files.video[0].path; // Assuming video is uploaded second
  

  // Check if course already exists
  const isCourseAlreadyAdded = await Course.findOne({ courseName });
  if (isCourseAlreadyAdded) {
    throw new ApiError(400, "Course is already added");
  }

  // Upload to Cloudinary
  const thumbnailCloudinaryUrl = await uploadImage(thumbnailPath);
  const videoCloudinaryUrl = await uploadImage(videoPath);

  // Create new course
  const newCourse = await Course.create({
    courseName,
    description,
    coursePrice,
    courseDuration,
    thumbnail: thumbnailCloudinaryUrl.url,
    video: videoCloudinaryUrl.url,
    instructor: req.user._id,
    createdBy: name,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newCourse, "Course uploaded successfully"));
});


const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({isPublished: true});
  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses fetched successfully"));
}); 


const getInstructorCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id });
  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses fetched successfully"));
}); 


const makeCoursePublished = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  console.log(courseId)

  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  const updatedCourse = await Course.findByIdAndUpdate(courseId, {
    $set: {
      isPublished: true,
    }
  }, { new: true });
   
  return res
  .status(200)
  .json(new ApiResponse(200, updatedCourse, "Course published successfully"));
})


// get sigle course

const getCourseDetails = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  console.log(courseId)
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, course, "Course fetched successfully"));
});


export { uploadCourse, getAllCourses, getInstructorCourses , makeCoursePublished , getCourseDetails };

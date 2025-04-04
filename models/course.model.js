import mongoose, { model } from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "courseName is required"],
      unique: [true, "courseName should be unique"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      maxLength: 100,
      minLength : 30
    },

    coursePrice: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
    },

    courseDuration: {
      type: String,
    },

    video : {
      type : String
    },

    createdBy : {
      type : String,
    },

    isPublished : {
      type : Boolean,
      default : false
    }, 

    // whatYouWillLearn : {
    //   type : String,
    // },

    // ratingAndReview : {
    //   type : mongoose.Schema.Types.ObjectId,
    //   ref : "Rating"
    // },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // tag: {
    //   type: String,
    // },

    studentEnrolled: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

  },
  { timestamps: true }
);

  export const Course = mongoose.model('Course' , courseSchema)



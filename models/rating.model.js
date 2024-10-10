import mongoose from "mongoose";

const ratingSchema  = new mongoose.Schema({
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
  },

  rating : {
    type : String,
    required : [true , "rating is required"],
  },

  review : {
    type : String,
    required : [true , "review is required"]
  }

})

export const Rating = mongoose.model("Rating" , ratingSchema);
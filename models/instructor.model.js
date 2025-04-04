import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  masterIn : {
    type: String, 
  },

  experience: {
    type: String,
    required: true,
  },

  currentCompany : {
    type: String
  },

  collegeName : {
    type: String
  },

  location: {
    type: String    
  },

  degree : {
    type: String
  },

  age  : {
     type : String
  }


}, {timestamps: true});

const Instructor = mongoose.model("Instructor", instructorSchema);  

export default Instructor;
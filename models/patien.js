import mongoose, { models } from "mongoose";

const patientSchema =  new mongoose.Schema({
    patientName:{
        type:String,
        required: true,

    }
} , {timestamps : true})

export const Patient = mongoose.models("Patient" , patientSchema);Pateint
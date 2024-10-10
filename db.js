import mongoose from "mongoose";

const connectDb = async() => {
    try{
       mongoose.connect(process.env.URI).then(() => {
        console.log('Db Connected Successfully 🚀' , mongoose.connection.name)
       })
    }catch(err){
        console.log('mongodb Error ❌' , err)
    }
}

export default connectDb;
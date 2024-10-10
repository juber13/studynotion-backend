import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
// import errorHandler from '../utils/errorMiddleware.js'
import errorHandler from './utils/errorMiddleware.js'

import logger from './utils/logger.js'
import morgan from 'morgan'

const morganFormat = ":method :url :status :response-time ms"

import connectDb from './db.js'

dotenv.config();
// connect db 
connectDb();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://studynotion-front-end-nkv6.vercel.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}))

// cloudinary config

// app.use(morgan(morganFormat , {
//   stream : {
//     write : (message) => {
//       const logObject = {
//         method : message.split(" ")[0],
//         url : message.split(" ")[1],  
//         status : message.split(" ")[2],
//         responseTime : message.split(" ")[3],
//       }
//       logger.info(JSON.stringify(logObject));
//     }
//   }
// }))


// import routers
import userRouter from './routes/user.route.js'
// import courseRouter from '../routes/course.route.js'
import courseRouter from './routes/course.route.js'


app.use('/api/user' , userRouter);
app.use('/api/course' , courseRouter);



// error handling middleware
app.use(errorHandler);  

app.listen(PORT , () => {
    console.log(`Server is running at ${PORT} ✅`)
})
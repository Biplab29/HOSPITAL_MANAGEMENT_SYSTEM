import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { dbConncetion } from './database/dbConnection.js';
import messageRouter from "./router/messageRouter.js";
import ErrorHandler from "./middlewares/errorMiddleware.js"
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appoimentRouter.js";


const app = express();
config({ path: "./config/config.env" });

// app.use(cors({
//         origin: 'http://localhost:5173' ,
//         methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         credentials: true, // if you use cookies
//       }));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow requests from both origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // if you use cookies
  }));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/temp/",
    })
);

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

dbConncetion();


app.use(ErrorHandler);

export default app;
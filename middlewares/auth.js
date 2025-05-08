import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";


export const isAdminAuthenticated = catchAsyncErrors(async(req , res, next) =>{
    const token = req.cookies.adminToken;
    if(!token){
        //return next(new ErrorHandler("Admin Not Authenticated!", 400));
        return res.status(401).json({message: "Dashboard User is not authenticated!"});
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    if(req.user.role !== "Admin"){
        //return next(new ErrorHandler(`${req.user.role}Not Authorized for this resources`, 403));
        return res.status(403).json({message: `${req.user.role}Not Authorized for this res`});
    }
    next();
});

export const isPatientAuthenticated = catchAsyncErrors(async(req , res, next) =>{
    const token = req.cookies.patientToken;
    if(!token){
        res.status(401).json({ message: "Patient Not Authenticated!" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    if(req.user.role !== "Patient"){
        //return next(new ErrorHandler(`${req.user.role}Not Authorized for this resources`, 403));
        return res.status(403).json({message: `${req.user.role}Not Authorized for this  resources`})
    }
    next();
});


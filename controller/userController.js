import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    console.log(req.body);  

    const { firstName, lastName, email, phone, password, gender, dob, nic, role } = req.body;

   
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !role) {
        //return next(new ErrorHandler("Please fill the full form!", 400));
        return res.status(400).json({ message: "Please fill the full form!" });
    }

    let user = await User.findOne({ email });
    if (user) {
        //return next(new ErrorHandler("User already registered!", 400));
        return res.status(400).json({ message: "User already registered!" });
    }

    // Create user if not exists
    user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role,
    });

 generateToken(user, "User registered successfully!", 201, res);
   
});


export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;
    
    if (!email || !password || !confirmPassword || !role) {
        // return next(new ErrorHandler("Please Provide All Details!", 400));
        res.status(401).json({ message: "Please Provide All Details!" });
    }

    if (password !== confirmPassword) {
        // return next(new ErrorHandler("Password and Confirm Password Do Not Match!", 400));
        res.status(401).json({ message: "Password and Confirm Password Do Not Match!"});
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        //return next(new ErrorHandler("Invalid Email or Password!", 401));
        res.status(401).json({ message: "Invalid Email or Password!" });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        //return next(new ErrorHandler("Invalid Email or Password!", 401));
        res.status(401).json({ message: "Invalid Email or Password!" });
    }

    if (role !== user.role) {
        //return next(new ErrorHandler("User With This Role Not Found!", 400));
        res.status(401).json({ message: "User With This Role Not Found!" });
    }
    generateToken(user, "User Logged In Successfully!", 200, res);

});

export const addNewAdmin = catchAsyncErrors(async(req,res,next) =>{
    const {firstName,lastName,email,phone,password,gender,dob,nic} = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic ) {
        //return next(new ErrorHandler("Please fill the full form!", 400));
        res.status(401).json({ message: "Please fill the full form!" });
    }
   const isRegistered = await User.findOne({ email });
   if (isRegistered) {
    //return next(new ErrorHandler(`${isRegistered.role}Admin With This Email Already Exists!`));
    res.status(401).json({ message: `${isRegistered.role}Admin With This Email Already Exists!` });
   }
   const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    role : "Admin",
   });
   res.status(201).json({
    success: true,
    message: "New Admin Registered!"
   });
});


export const getAllDoctors = catchAsyncErrors(async(req,res,next) =>{
    const doctors = await User.find({role: "Doctor"});
    res.status(200).json({
        success: true,
        doctors,
    });
});

export const getUserDetails = catchAsyncErrors(async(req,res ,next) =>{
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const logoutAdmin = catchAsyncErrors(async(req,res,next) =>{
    res.status(200).cookie("adminToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    .json({
        success: true,
        message: "Admin Logout Successfully!",
    });
});

export const logoutPatient = catchAsyncErrors(async(req,res,next) =>{
    res.status(200).cookie("patientToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    .json({
        success: true,
        message: "Patient Logout Successfully!",
    });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        //return next(new ErrorHandler("Doctor Avatar Required", 400));
        return res.status(400).json({message: "Doctor Avatar Required"});

    }

    const { docAvatar } = req.files; 

    const allowedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
        //return next(new ErrorHandler("File format not supported!", 400));
        return res.status(400).json({message: "File format not supported!"});
    }
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartment,
    } = req.body;

    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !nic ||
        !doctorDepartment
    ) {
        //return next(new ErrorHandler("Please Provide Full Details!", 400));
        res.status(400).json({message: "Please Provide Full Details!"});
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
       // return next(new ErrorHandler(`${isRegistered.role} Email Already Registered!`, 400));
       res.status(400).json({message: `${isRegistered.role} Email Already Registered!`});
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(docAvatar.tempFilePath); 

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary Error");
       // return next(new ErrorHandler("Failed to upload image", 500));
       res.status(500).json({message: "Failed to upload image"});
    }

    const doctor = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartment,
        role: "Doctor",
        docAvatar: {  
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    res.status(200).json({
        success: true,
        message: "Doctor Registered Successfully",
        doctor,
    });
});

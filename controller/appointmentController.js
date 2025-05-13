import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
//import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address

  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    //return next(new ErrorHandler("Please fill in all fields", 400));
    return res.status(400).json({message: "Please fill in all fields"});
  }

  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });

  if (isConflict.length === 0) {
    // return next(new ErrorHandler("Doctor not found!", 404));
    return res.status(404).json({message: "Doctor not found!"});
  }

  if (isConflict.length > 1) {
    // return next(
      //new ErrorHandler("Doctor conflict! Please contact through email or phone", 409)
      return res.status(404).json({message: "Doctor conflict! Please contact through email or phone"});
    //);
  }

  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;

  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });

  res.status(200).json({
    success: true,
    message: "Appointment sent successfully",
    appointment,
  });
});



export const getAllAppointment = catchAsyncErrors(async(req,res) =>{
    const appointments = await Appointment.find({});
    res.status(200).json({
        success: true,
        appointments,
    });
});

// Update the Appoinement Status

export const updateAppointmentStatus = catchAsyncErrors(async(req,res,next) =>{
    const {id} = req.params;
    let appointment = await Appointment.findById(id);
    if(!appointment){
        //return next(new ErrorHandler("Appointment not found", 404));
        return res.status(404).json({ success: false, message: "Appointment not found"});
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body,{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        message: "Appointment status updated successfully",
        appointment,
    });
});


export const deleteAppointment = catchAsyncErrors(async(req, res, next) =>{
    const {id} = req.params;
    let appointment = await Appointment.findById(id);
    
    if(!appointment){
        //return next(new ErrorHandler("Appointment not found", 404));
        return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    await appointment.deleteOne();
    res.status(200).json({
        success: true,
        message: "Appointment deleted successfully",
    });
});
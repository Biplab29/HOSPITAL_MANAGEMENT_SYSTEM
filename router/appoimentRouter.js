import express from "express";
import  {deleteAppointment, getAllAppointment, postAppointment, updateAppointmentStatus}  from "../controller/appointmentController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send", isPatientAuthenticated, postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointment);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);

export default router;

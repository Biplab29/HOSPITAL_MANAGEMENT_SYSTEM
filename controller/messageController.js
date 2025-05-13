
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Message } from "../models/messageSchema.js";
//import ErrorHandler from "../middlewares/errorMiddleware.js";

export const sendMessage = async (req, res, next) => {
    try {
      const { firstName, lastName, email, phone, message } = req.body;
  
      if (!firstName || !lastName || !email || !phone || !message) {
        //return next(new ErrorHandler("Please fill in all fields.", 400));
        return res.status(400).json({ success: false, message: "Please fill in all fields." });

      }
      await Message.create({ firstName, lastName, email, phone, message });
      res.status(200).json({
        success: true,
        message: "Message sent successfully!",
      });
    } catch (error) {
      next(error);
    }
  };
  
export const getAllMessages = catchAsyncErrors(async(req,res,next) =>{
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages,
    });
});

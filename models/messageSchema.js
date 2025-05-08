import mongoose from 'mongoose';
import validator from 'validator';


const messageSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "First Name Must Containt At Least #  Characters!"],
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, " Last Name Must Containt At Least 3  Characters!"],
    },
    email: {
        type: String,
        required: true,
        validate: {
          validator: validator.isEmail,
          message: "Please provide a valid email!",
        },
      },      
    phone:{
        type: String,
        required: true,
        minLength: [11, "Phone Number Must Containt At Least 11  Characters!"],
    },
    message:{
        type: String,
        required: true,
        minLength: [10, "Mesage Must Containt At Least 10  Characters!"],
    }
});

export const Message = mongoose.model("Message", messageSchema);
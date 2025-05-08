import mongoose from "mongoose";



export const dbConncetion = () =>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName : "Hospital_Managaement_Syatem"
    }) 
    .then(() =>{
        console.log("Connectes to database! ✅");
    })
    .catch((err) =>{
        console.log(`Some error occured while connecting to database : ${err}`);
    });
};
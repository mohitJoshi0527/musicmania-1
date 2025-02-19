import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI).then((data)=>{
            console.log(`Database connected with ${data.connection.host}`)
        })
    } catch (error) {
        console.log(error.message);
        
    }
}
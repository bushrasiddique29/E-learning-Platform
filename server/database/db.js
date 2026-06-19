import mongoose from "mongoose";


export const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.DB)
        .then(()=> console.log('DATABASE CONNECTED')
        ).catch(err=> console.log(err))
    } catch (error) {
        console.log(error);
    }
};
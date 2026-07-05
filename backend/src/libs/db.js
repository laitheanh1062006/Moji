import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("Database connected");
    } catch (error) {
        console.log("error: ", error);
        process.exit(1);
    }
}
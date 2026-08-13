import mongoose from "mongoose";
import dns from "dns";

export const connectDB = async () => {
    try {
        // Force Node resolver to use Google and Cloudflare DNS
        dns.setServers(["8.8.8.8", "1.1.1.1"]);

        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);

        console.log("Database connected");
    } catch (error) {
        console.log("error: ", error);
        process.exit(1);
    }
}
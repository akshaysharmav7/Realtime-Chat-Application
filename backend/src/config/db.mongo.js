import mongoose from "mongoose";

export const connectDb = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb Connection Successful", conn.connection.host);
    } catch (error) {
        console.log("Error connecting to mongodb", error);
        process.exit(1)
    }
}
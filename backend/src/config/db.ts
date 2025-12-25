import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let MONGO_URI = process.env.MONGO_URI;
let DB_NAME = process.env.DB_NAME;

const connectDB = async (): Promise<void> => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    mongoose.set("strictQuery", true);

    await mongoose.connect(MONGO_URI, {
      dbName: DB_NAME || "MindEase",
      autoIndex: process.env.NODE_ENV !== "production",
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected ${mongoose.connection.host} `);
  } catch (error) {
    console.log("MongoDB Connection Failed : ", (error as Error).message);
    process.exit(1);
  }

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Trying to reconnect...");
  });
};

export default connectDB


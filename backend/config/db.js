// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("MONGO_URI missing");
      process.exit(1);
    }
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB error:", err.message);
    setTimeout(connectDB, 3000);
  }
};

export default connectDB;

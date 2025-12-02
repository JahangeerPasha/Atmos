// models/User.js
import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["Student", "Mentor", "Admin"], default: "Student" },
  team: { type: String, default: "TeamA" } // optional team field
}, { timestamps: true });

export default mongoose.model("User", schema);

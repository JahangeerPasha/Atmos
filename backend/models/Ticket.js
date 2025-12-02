// models/Ticket.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  studentName: String,
  status: { type: String, enum: ["Pending", "Claimed", "Resolved"], default: "Pending" },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  claimedByName: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  claimedAt: Date,
  resolvedAt: Date,
  team: String // optionally used for team routing
});

export default mongoose.model("Ticket", ticketSchema);

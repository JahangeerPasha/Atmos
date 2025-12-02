// routes/auth.routes.js
import express from "express";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// register (Admin can create other roles too)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, team } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role || "Student", team });
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u) return res.status(404).json({ message: "User not found" });
    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET);
    res.json({ token, user: { _id: u._id, name: u.name, email: u.email, role: u.role, team: u.team } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// public summary for marketing/login
router.get("/summary", async (req, res) => {
  try {
    const [totalTickets, pending, claimed, resolved, mentorCount, studentCount] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: "Pending" }),
      Ticket.countDocuments({ status: "Claimed" }),
      Ticket.countDocuments({ status: "Resolved" }),
      User.countDocuments({ role: "Mentor" }),
      User.countDocuments({ role: "Student" })
    ]);

    res.json({
      totalTickets,
      pending,
      claimed,
      resolved,
      mentorCount,
      studentCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get current user
router.get("/me", verifyToken, (req, res) => {
  res.json(req.user);
});

export default router;

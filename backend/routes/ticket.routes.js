// routes/ticket.routes.js
import express from "express";
import Ticket from "../models/Ticket.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import { io } from "../server.js";

const router = express.Router();

// Student creates ticket
router.post("/create", verifyToken, authorizeRoles("Student"), async (req, res) => {
  const { title, description } = req.body;
  const ticket = await Ticket.create({
    title,
    description,
    student: req.user._id,
    studentName: req.user.name,
    team: req.user.team || "TeamA"
  });

  // broadcast to mentors room
  io.to(`mentors_${ticket.team}`).emit("new_ticket", ticket);
  io.to(`students_${req.user._id}`).emit("ticket_created", ticket); // student private room
  res.json({ success: true, ticket });
});

// Mentor fetch pending tickets (or all)
router.get("/pending", verifyToken, authorizeRoles("Mentor"), async (req, res) => {
  const team = req.user.team || "TeamA";
  const list = await Ticket.find({ team, status: "Pending" }).sort({ createdAt: 1 });
  res.json(list);
});

// Mentor claims a ticket (atomic-ish)
router.post("/claim", verifyToken, authorizeRoles("Mentor"), async (req, res) => {
  const { ticketId } = req.body;
  // find and atomically update only if still Pending
  const ticket = await Ticket.findOneAndUpdate(
    { _id: ticketId, status: "Pending" },
    { status: "Claimed", claimedBy: req.user._id, claimedByName: req.user.name, claimedAt: new Date() },
    { new: true }
  );
  if (!ticket) return res.status(409).json({ message: "Ticket already claimed or not found" });

  // notify all mentors to remove the ticket from pending
  io.to(`mentors_${ticket.team}`).emit("ticket_claimed", ticket);
  // notify the student
  io.to(`students_${ticket.student}`).emit("ticket_claimed_student", ticket);
  // update mentor personal room
  io.to(`mentor_${req.user._id}`).emit("ticket_added_to_myqueue", ticket);

  res.json({ success: true, ticket });
});

// Mentor resolves a ticket
router.post("/resolve", verifyToken, authorizeRoles("Mentor"), async (req, res) => {
  const { ticketId } = req.body;
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return res.status(404).json({ message: "Not found" });
  // allow only the claiming mentor to resolve (or admin)
  if (String(ticket.claimedBy) !== String(req.user._id) && req.user.role !== "Admin") {
    return res.status(403).json({ message: "Not allowed to resolve" });
  }

  ticket.status = "Resolved";
  ticket.resolvedAt = new Date();
  await ticket.save();

  io.to(`mentors_${ticket.team}`).emit("ticket_resolved", ticket);
  io.to(`students_${ticket.student}`).emit("ticket_resolved_student", ticket);
  io.to(`mentor_${ticket.claimedBy}`).emit("ticket_removed_from_myqueue", ticket);
  res.json({ success: true, ticket });
});

// Mentor stats for dashboard display
router.get("/mentor/stats", verifyToken, authorizeRoles("Mentor"), async (req, res) => {
  const team = req.user.team || "TeamA";
  const pending = await Ticket.countDocuments({ team, status: "Pending" });
  const myQueue = await Ticket.countDocuments({ claimedBy: req.user._id, status: { $in: ["Claimed", "Resolved"] } });
  const resolvedRecords = await Ticket.find({ claimedBy: req.user._id, resolvedAt: { $ne: null }, claimedAt: { $ne: null } }).select("claimedAt resolvedAt");
  const totalResolveMs = resolvedRecords.reduce((acc, ticket) => acc + Math.max(0, ticket.resolvedAt - ticket.claimedAt), 0);
  const avgResolveMinutes = resolvedRecords.length ? Number((totalResolveMs / resolvedRecords.length / 60000).toFixed(1)) : 0;

  res.json({ pending, myQueue, avgResolveMinutes });
});

// Student gets their tickets
router.get("/my", verifyToken, authorizeRoles("Student"), async (req, res) => {
  const tickets = await Ticket.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.json(tickets);
});

// Dashboard stats for student
router.get("/stats", verifyToken, authorizeRoles("Student"), async (req, res) => {
  const studentId = req.user._id;
  const [totalTickets, pendingCount, claimedCount, resolvedCount] = await Promise.all([
    Ticket.countDocuments({ student: studentId }),
    Ticket.countDocuments({ student: studentId, status: "Pending" }),
    Ticket.countDocuments({ student: studentId, status: "Claimed" }),
    Ticket.countDocuments({ student: studentId, status: "Resolved" })
  ]);

  const resolvedRecords = await Ticket.find({ student: studentId, status: "Resolved" }).select(
    "createdAt resolvedAt"
  );
  const totalResolveMinutes = resolvedRecords.reduce((acc, ticket) => {
    const created = ticket.createdAt?.getTime?.() ?? 0;
    const resolved = ticket.resolvedAt?.getTime?.() ?? 0;
    return acc + Math.max(0, resolved - created);
  }, 0);
  const avgResolveMinutes = resolvedRecords.length
    ? Number((totalResolveMinutes / resolvedRecords.length / 60000).toFixed(1))
    : 0;

  res.json({
    totalTickets,
    pending: pendingCount,
    claimed: claimedCount,
    resolved: resolvedCount,
    avgResolveMinutes
  });
});

export default router;

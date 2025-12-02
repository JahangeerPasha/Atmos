// routes/admin.routes.js
import express from "express";
import Ticket from "../models/Ticket.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Aggregated stats: avg wait, avg resolve, counts
router.get("/stats", verifyToken, authorizeRoles("Admin"), async (req, res) => {
  const total = await Ticket.countDocuments();
  const pending = await Ticket.countDocuments({ status: "Pending" });
  const claimed = await Ticket.countDocuments({ status: "Claimed" });
  const resolved = await Ticket.countDocuments({ status: "Resolved" });

  // avg wait time (claimedAt - createdAt) for resolved or claimed
  const claimedTickets = await Ticket.find({ claimedAt: { $ne: null } }).select("createdAt claimedAt resolvedAt");
  let totalWait = 0, waitCount = 0;
  claimedTickets.forEach(t => {
    if (t.claimedAt) {
      totalWait += (t.claimedAt - t.createdAt);
      waitCount++;
    }
  });

  const avgWaitMs = waitCount ? totalWait / waitCount : 0;
  const avgWaitMin = Math.round(avgWaitMs / 60000);

  // avg resolve time (resolvedAt - claimedAt)
  const resolvedTickets = await Ticket.find({ resolvedAt: { $ne: null }, claimedAt: { $ne: null } }).select("claimedAt resolvedAt");
  let totalResolve = 0, resolveCount = 0;
  resolvedTickets.forEach(t => {
    totalResolve += (t.resolvedAt - t.claimedAt);
    resolveCount++;
  });

  const avgResolveMin = resolveCount ? Math.round(totalResolve / resolveCount / 60000) : 0;

  res.json({
    total, pending, claimed, resolved,
    avgWaitMin, avgResolveMin
  });
});

export default router;

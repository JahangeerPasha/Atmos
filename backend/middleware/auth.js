// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
    const token = header.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid token" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};

export const authorizeRoles = (...allowed) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (!allowed.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};

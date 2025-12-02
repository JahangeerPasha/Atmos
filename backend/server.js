// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import registerSocketHandlers from "./socket/socket.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// configure CORS for frontend origin
const FRONTEND = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: FRONTEND, credentials: true }));

app.use("/auth", authRoutes);
app.use("/tickets", ticketRoutes);
app.use("/admin", adminRoutes);

const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: FRONTEND, credentials: true },
});

registerSocketHandlers(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));

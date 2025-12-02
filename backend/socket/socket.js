// socket/socket.js
export default function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("socket connected", socket.id);

    // join rooms based on query (client should emit join events)
    socket.on("join_rooms", ({ userId, role, team }) => {
      try {
        if (role === "Mentor") {
          socket.join(`mentors_${team}`);
          socket.join(`mentor_${userId}`);
        } else if (role === "Student") {
          socket.join(`students_${userId}`);
        } else if (role === "Admin") {
          socket.join("admins");
        }
      } catch (e) {
        console.error("join_rooms error", e);
      }
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected", socket.id);
    });
  });
}

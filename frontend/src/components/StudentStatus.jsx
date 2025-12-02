import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { socket } from "../socket";

export default function StudentStatus() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Load student's tickets
    async function loadTickets() {
      try {
        const res = await api.get("/tickets/mine");
        setTickets(res.data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    }

    loadTickets();

    // Live ticket claimed event
    socket.on("ticket_claimed", (ticket) => {
      setTickets((prev) =>
        prev.map((t) => (t._id === ticket._id ? ticket : t))
      );
    });

    // Live ticket resolved event
    socket.on("ticket_resolved", (ticket) => {
      setTickets((prev) =>
        prev.map((t) => (t._id === ticket._id ? ticket : t))
      );
    });

    return () => {
      socket.off("ticket_claimed");
      socket.off("ticket_resolved");
    };
  }, []);

  return (
    <div>
      <h3>My Ticket Status (live)</h3>

      {tickets.length === 0 && <p>No updates yet.</p>}

      {tickets.map((t) => (
        <div
          key={t._id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            margin: "10px 0",
            borderRadius: 5,
          }}
        >
          <p><strong>Description:</strong> {t.description}</p>
          <p><strong>Status:</strong> {t.status}</p>
          <p>
            <strong>Claimed By:</strong>{" "}
            {t.claimedBy ? t.claimedBy.name : "No one yet"}
          </p>
        </div>
      ))}
    </div>
  );
}

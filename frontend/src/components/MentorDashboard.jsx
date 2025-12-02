import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import api from "../api/axios";

export default function MentorDashboard() {
  const [pending, setPending] = useState([]);
  const [myQueue, setMyQueue] = useState([]);

  const [me] = useState(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  });

  useEffect(() => {
    if (!me) return;

    // initial load via REST
    (async () => {
      try {
        const res = await api.get("/tickets/pending");
        setPending(res.data);

        const myRes = await api.get("/tickets/my");
        setMyQueue(myRes.data);
      } catch (err) {
        console.error(err);
      }
    })();

    // socket initial
    socket.emit("get_initial");

    socket.on("initial_pending", (list) => {
      setPending(list);
    });

    socket.on("new_ticket", (ticket) => {
      setPending((p) => [...p, ticket]);
    });

    socket.on("ticket_claimed", (ticket) => {
      setPending((p) => p.filter((t) => t._id !== ticket._id));

      if (ticket.claimedBy && me && ticket.claimedBy._id === me.id) {
        setMyQueue((q) => [ticket, ...q]);
      }
    });

    socket.on("ticket_resolved", (ticket) => {
      setPending((p) => p.filter((t) => t._id !== ticket._id));
      setMyQueue((q) => q.filter((t) => t._id !== ticket._id));
    });

    socket.on("claim_failed", ({ ticketId }) => {
      setPending((p) => p.filter((t) => t._id !== ticketId));
    });

    return () => {
      socket.off("initial_pending");
      socket.off("new_ticket");
      socket.off("ticket_claimed");
      socket.off("ticket_resolved");
      socket.off("claim_failed");
    };
  }, [me]);

  // FIXED claim function
  const doClaim = (ticketId) => {
    if (!me || !me.id) {
      console.error("Mentor not loaded yet");
      return;
    }
    socket.emit("claim_ticket", { ticketId, mentorId: me.id });
  };

  const doResolve = (ticketId) => {
    socket.emit("resolve_ticket", { ticketId });
  };

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ flex: 1 }}>
        <h3>Pending</h3>
        {pending.length === 0 && <p>No pending tickets</p>}
        {pending.map((t) => (
          <div key={t._id} style={{ border: "1px solid #ccc", padding: 8, margin: 6 }}>
            <div><strong>{t.description}</strong></div>
            <div>Student: {t.student?.name || "anonymous"}</div>
            <button onClick={() => doClaim(t._id)}>Claim</button>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        <h3>My Queue</h3>
        {myQueue.length === 0 && <p>Your queue is empty</p>}
        {myQueue.map((t) => (
          <div key={t._id} style={{ border: "1px solid #ddd", padding: 8, margin: 6 }}>
            <div><strong>{t.description}</strong></div>
            <div>Student: {t.student?.name}</div>
            <div>Status: {t.status}</div>
            <button onClick={() => doResolve(t._id)}>Resolve</button>
          </div>
        ))}
      </div>
    </div>
  );
}

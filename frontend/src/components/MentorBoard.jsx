import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import { socket } from "../socket";
import "./MentorBoard.css";

function TicketCard({ ticket, action }) {
  return (
    <div className="mentor-ticket-card">
      <div className="mentor-ticket-header">
        <strong>{ticket.title}</strong>
        <span className={`status-pill ${ticket.status.toLowerCase()}`}>{ticket.status}</span>
      </div>
      {ticket.description && <p className="mentor-ticket-desc">{ticket.description}</p>}
      <div className="mentor-ticket-meta">
        <span>Student: {ticket.studentName}</span>
        {ticket.claimedByName && <span>Mentor: {ticket.claimedByName}</span>}
      </div>
      {action && (
        <button className="ticket-btn" onClick={() => action.handler(ticket._id)}>
          {action.label}
        </button>
      )}
    </div>
  );
}

export default function MentorBoard({ user }) {
  const [pending, setPending] = useState([]);
  const [myQueue, setMyQueue] = useState([]);
  const [stats, setStats] = useState({ pending: 0, myQueue: 0, avgResolveMinutes: 0 });

  const loadStats = useCallback(async () => {
    try {
      const res = await api.get("/tickets/mentor/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load mentor stats", err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/tickets/pending");
      setPending(res.data);
    };
    load();
    loadStats();

    socket.on("new_ticket", t => {
      setPending(prev => [t, ...prev]);
      loadStats();
    });
    socket.on("ticket_claimed", t => {
      setPending(prev => prev.filter(x => x._id !== t._id));
      loadStats();
    });
    socket.on("ticket_resolved", t => {
      setPending(prev => prev.filter(x => x._id !== t._id));
      setMyQueue(prev => prev.filter(x => x._id !== t._id));
      loadStats();
    });
    socket.on("ticket_added_to_myqueue", t => {
      setMyQueue(prev => [t, ...prev]);
      loadStats();
    });
    socket.on("ticket_removed_from_myqueue", t => {
      setMyQueue(prev => prev.filter(x => x._id !== t._id));
      loadStats();
    });

    return () => {
      socket.off("new_ticket");
      socket.off("ticket_claimed");
      socket.off("ticket_resolved");
      socket.off("ticket_added_to_myqueue");
      socket.off("ticket_removed_from_myqueue");
    };
  }, [loadStats]);

  const claim = async (id) => {
    try {
      await api.post("/tickets/claim", { ticketId: id });
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || "Claim failed");
    }
  };

  const resolve = async (id) => {
    try {
      await api.post("/tickets/resolve", { ticketId: id });
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || "Resolve failed");
    }
  };

  return (
    <div className="mentor-board">
      <div className="mentor-board-surface">
        <div className="mentor-hero">
          <div>
            <p className="mentor-hero-pill">Mentor Console</p>
            <h3>Own the queue</h3>
            <p>Claim urgent doubts, resolve swiftly, and keep your response time in check.</p>
          </div>
          <div className="mentor-stats">
            <div>
              <span>Team pending</span>
              <strong>{stats.pending}</strong>
            </div>
            <div>
              <span>My queue</span>
              <strong>{stats.myQueue}</strong>
            </div>
            <div>
              <span>Avg resolve</span>
              <strong>{stats.avgResolveMinutes} min</strong>
            </div>
          </div>
        </div>

        <div className="mentor-panels">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h4>Pending tickets</h4>
              <p>Team: {user?.team || "TeamA"}</p>
            </div>
            <span className="panel-count">{pending.length}</span>
          </div>
          {pending.map(t => (
            <TicketCard
              key={t._id}
              ticket={t}
              action={{ label: "Claim request", handler: claim }}
            />
          ))}
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h4>My queue</h4>
              <p>Tickets you have claimed</p>
            </div>
            <span className="panel-count">{myQueue.length}</span>
          </div>
          {myQueue.map(t => (
            <TicketCard
              key={t._id}
              ticket={t}
              action={{ label: "Resolve now", handler: resolve }}
            />
          ))}
        </section>
        </div>
      </div>
    </div>
  );
}

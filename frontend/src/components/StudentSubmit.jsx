import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import { socket } from "../socket";
import "./StudentSubmit.css";

export default function StudentSubmit({ user }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [myTickets, setMyTickets] = useState([]);
  const [stats, setStats] = useState({
    totalTickets: 0,
    pending: 0,
    claimed: 0,
    resolved: 0,
    avgResolveMinutes: 0
  });

  const loadStats = useCallback(async () => {
    try {
      const res = await api.get("/tickets/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/tickets/my");
      setMyTickets(res.data);
    };
    load();
    loadStats();

    // real-time student updates
    socket.on("ticket_created", t => {
      setMyTickets(prev => [t, ...prev]);
      loadStats();
    });
    socket.on("ticket_claimed_student", t => {
      setMyTickets(prev => prev.map(x => x._id === t._id ? t : x));
      loadStats();
    });
    socket.on("ticket_resolved_student", t => {
      setMyTickets(prev => prev.map(x => x._id === t._id ? t : x));
      loadStats();
    });

    return () => {
      socket.off("ticket_created");
      socket.off("ticket_claimed_student");
      socket.off("ticket_resolved_student");
    };
  }, [loadStats]);

  const submit = async () => {
    if (!title.trim()) return alert("Title required");
    await api.post("/tickets/create", { title, description });
    setTitle(""); setDescription("");
    loadStats();
  };

  return (
    <div className="student-submit">
      <div className="student-hero">
        <div>
          <p className="hero-tag">Hello {user?.name || "student"}, keep your queue neat.</p>
          <h3>Queue Insights</h3>
          <p className="hero-desc">Track your tickets and stay in sync with mentors in real time.</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Open</span>
            <strong>{stats.pending}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Claimed</span>
            <strong>{stats.claimed}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Resolved</span>
            <strong>{stats.resolved}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Avg. Resolve (min)</span>
            <strong>{stats.avgResolveMinutes}</strong>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-card">
          <div className="form-head">
            <h3>Create Ticket</h3>
            <p>Explain the issue clearly so mentors can jump in faster.</p>
          </div>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea placeholder="Describe issue" value={description} onChange={e => setDescription(e.target.value)} />
          <button className="primary" onClick={submit}>Join Queue</button>
        </div>

        <div className="tickets-card">
          <div className="tickets-head">
            <h3>My Tickets</h3>
            <span className="tickets-count">{myTickets.length} total</span>
          </div>
          {myTickets.map(t => (
            <div key={t._id} className="ticket-card">
              <div className="ticket-card-header">
                <strong>{t.title}</strong>
                <span className={`status-pill ${t.status.toLowerCase()}`}>{t.status}</span>
              </div>
              {t.description ? <p className="ticket-desc">{t.description}</p> : null}
              {t.claimedByName && (
                <div className="ticket-meta">Mentor: {t.claimedByName}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

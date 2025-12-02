import { useEffect, useState } from "react";
import { api } from "../api";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/auth/summary");
        setSummary(res.data);
      } finally {
        setLoadingSummary(false);
      }
    };
    load();
  }, []);

  const login = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        <section className="login-hero">
          <p className="login-hero-pill">Queue Control</p>
          <h1>Access the mentoring hub</h1>
          <p className="login-hero-copy">
            Sign in as a mentor or admin to track tickets, guide students, and keep the queue flowing.
          </p>
          <div className="summary-grid">
            {loadingSummary && <span className="summary-placeholder">Loading queue stats…</span>}
            {!loadingSummary && summary && (
              [
                ["Tickets", summary.totalTickets],
                ["Pending", summary.pending],
                ["Mentors", summary.mentorCount],
                ["Students", summary.studentCount]
              ].map(([label, value]) => (
                <article key={label} className="summary-card">
                  <span className="summary-label">{label}</span>
                  <strong>{value}</strong>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="login-form-shell">
          <div className="login-card">
            <h2>Team sign-in</h2>
            <p className="subtle">Use your admin or mentor credentials to unlock the workspace.</p>
            <input value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input
              value={password}
              type="password"
              placeholder="Password"
              onChange={e => setPassword(e.target.value)}
            />
            <button className="primary" onClick={login}>Login</button>
          </div>
          <div className="login-role-grid">
            <article>
              <h3>Admin desk</h3>
              <p>Oversee university-wide queue health, monitor response times, and unblock critical requests.</p>
            </article>
            <article>
              <h3>Mentor desk</h3>
              <p>Claim the most urgent student doubts, stay notified in real time, and resolve faster.</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}

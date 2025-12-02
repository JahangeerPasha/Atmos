import { useEffect, useState } from "react";
import { api } from "../api";
import "./AdminStats.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function AdminStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    };
    load();
  }, []);

  if (!stats) return <div className="admin-loading">Loading…</div>;

  const chartData = {
    labels: ["Pending", "Claimed", "Resolved"],
    datasets: [
      {
        label: "Tickets",
        data: [stats.pending, stats.claimed, stats.resolved],
        backgroundColor: ["#facc15", "#2563eb", "#16a34a"],
        borderRadius: 12,
      },
    ],
  };

  return (
    <div className="admin-stats">
      <div className="admin-hero">
        <div>
          <p className="admin-hero-tag">Admin Console</p>
          <h3>Queue Control Center</h3>
          <p>Monitor team health, wait times, and resolution pace from a single cockpit.</p>
        </div>
        <div className="admin-hero-stats">
          <div>
            <span>Avg wait</span>
            <strong>{stats.avgWaitMin} min</strong>
          </div>
          <div>
            <span>Avg resolve</span>
            <strong>{stats.avgResolveMin} min</strong>
          </div>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h4>Counts</h4>
          <div className="metric-row"><span>Total</span><strong>{stats.total}</strong></div>
          <div className="metric-row"><span>Pending</span><strong>{stats.pending}</strong></div>
          <div className="metric-row"><span>Claimed</span><strong>{stats.claimed}</strong></div>
          <div className="metric-row"><span>Resolved</span><strong>{stats.resolved}</strong></div>
        </div>
        <div className="admin-card">
          <h4>Timings</h4>
          <div className="metric-row"><span>Avg wait</span><strong>{stats.avgWaitMin} min</strong></div>
          <div className="metric-row"><span>Avg resolve</span><strong>{stats.avgResolveMin} min</strong></div>
        </div>
        <div className="admin-chart-card">
          <h4>Status breakdown</h4>
          <Bar data={chartData} options={{
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { drawBorder: false } } }
          }} />
        </div>
      </div>
    </div>
  );
}

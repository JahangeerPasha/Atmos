import React, { useEffect, useState } from "react";
import api from "../api/axios";

/*
 AdminDashboard:
 - Shows ticket counts per status (uses /api/tickets/stats)
 - Lists users (GET /api/users)
 - Allows admin to create a new user (role select)
*/

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/tickets/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createUser = async () => {
    try {
      const res = await api.post("/auth/register", form);
      setMsg("User created");
      setForm({ name: "", email: "", password: "", role: "student" });
      fetchUsers();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      <section style={{ marginBottom: 20 }}>
        <h3>Live Ticket Stats</h3>
        {stats.length === 0 && <p>No data</p>}
        <ul>
          {stats.map((s) => (
            <li key={s._id}>
              {s._id}: {s.count}
            </li>
          ))}
        </ul>
        <button onClick={fetchStats}>Refresh</button>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h3>Create User (Admin)</h3>
        <input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
        <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} />
        <input placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} />
        <select value={form.role} onChange={(e)=>setForm({...form, role: e.target.value})}>
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={createUser}>Create</button>
        <div style={{ color: "red" }}>{msg}</div>
      </section>

      <section>
        <h3>Users</h3>
        {users.length === 0 && <p>No users</p>}
        {users.map(u => (
          <div key={u._id} style={{ border: "1px solid #ddd", padding: 8, margin: 6 }}>
            <div><strong>{u.name}</strong> ({u.email}) — {u.role}</div>
            <button onClick={() => deleteUser(u._id)}>Delete</button>
          </div>
        ))}
      </section>
    </div>
  );
}

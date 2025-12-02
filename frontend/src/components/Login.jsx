import React, { useContext, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const doLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, role, name, id } = res.data;
      localStorage.setItem("token", token);
      setUser({ name, role, id });
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    }
  };

  // quick register helper for testing
  const quickRegister = async (role) => {
    const name = `${role}_user`;
    try {
      await api.post("/auth/register", { name, email: `${role}@local`, password: "pass123", role });
      setMsg("Registered. Then login.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <button onClick={doLogin}>Login</button>
      <p style={{ color: "red" }}>{msg}</p>

      <hr />
      <div>
        <strong>Quick register (for dev):</strong>
        <br />
        <button onClick={() => quickRegister("student")}>Register Student</button>
        <button onClick={() => quickRegister("mentor")}>Register Mentor</button>
        <button onClick={() => quickRegister("admin")}>Register Admin</button>
        <p>Then login with the email: student@local etc and password pass123</p>
      </div>
    </div>
  );
}

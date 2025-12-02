import React, { useState } from "react";
import api from "../api/axios";

export default function RegisterStudent() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const submit = async () => {
    try {
      const res = await api.post("/auth/register-student", form);
      setMsg("Student registered. You can now login.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div>
      <h3>Register Student</h3>
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button onClick={submit}>Register</button>
      <p>{msg}</p>
    </div>
  );
}

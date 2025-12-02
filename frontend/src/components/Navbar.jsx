export default function Navbar({ user }) {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div style={{ background: "#000", color: "#fff", padding: 12, display: "flex", justifyContent: "space-between" }}>
      <div style={{ fontWeight: "bold" }}>Queue System — {user.role}</div>
      <div>
        <span style={{ marginRight: 12 }}>{user.name}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

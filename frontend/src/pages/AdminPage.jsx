import Navbar from "../components/Navbar";
import AdminStats from "../components/AdminStats";

export default function AdminPage({ user }) {
  return (
    <>
      <Navbar user={user} />
      <div style={{ padding: 20 }}>
        <h2>Admin Dashboard</h2>
        <AdminStats />
      </div>
    </>
  );
}

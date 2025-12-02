import Navbar from "../components/Navbar";
import StudentSubmit from "../components/StudentSubmit";

export default function StudentPage({ user }) {
  return (
    <>
      <Navbar user={user} />
      <div style={{ padding: 20 }}>
        <h2>Student Dashboard</h2>
        <StudentSubmit user={user} />
      </div>
    </>
  );
}

import Navbar from "../components/Navbar";
import MentorBoard from "../components/MentorBoard";

export default function MentorPage({ user }) {
  return (
    <>
      <Navbar user={user} />
      <div style={{ padding: 20 }}>
        <h2>Mentor Dashboard</h2>
        <MentorBoard user={user} />
      </div>
    </>
  );
}

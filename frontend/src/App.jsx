import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import StudentPage from "./pages/StudentPage";
import MentorPage from "./pages/MentorPage";
import AdminPage from "./pages/AdminPage";
import { api } from "./api";
import { socket } from "./socket";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    api.get("/auth/me").then(res => {
      setUser(res.data);
      // connect socket and join rooms
      socket.auth = { token };
      socket.connect();
      socket.emit("join_rooms", { userId: res.data._id, role: res.data.role, team: res.data.team });
    }).catch(() => {
      localStorage.removeItem("token");
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    if (!user) return <LoginPage />;
    if (user.role === "Student") return <StudentPage user={user} />;
    if (user.role === "Mentor") return <MentorPage user={user} />;
    if (user.role === "Admin") return <AdminPage user={user} />;
    return <div>Unknown role</div>;
  };

  return (
    <>
      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-card">
            <p className="welcome-hello">Hii Infotech students, how are you?</p>
            <p className="welcome-copy">Welcome back to the queue hub — click below and open the site.</p>
            <button className="welcome-btn" onClick={() => setShowWelcome(false)}>
              Open site
            </button>
          </div>
        </div>
      )}
      {renderContent()}
    </>
  );
}

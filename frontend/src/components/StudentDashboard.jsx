import React from "react";
import StudentSubmit from "./StudentSubmit";
import StudentStatus from "./StudentStatus";

export default function StudentDashboard() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Student Dashboard</h1>
      <p>Use this page to submit tickets and watch status updates.</p>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <StudentSubmit />
        </div>
        <div style={{ flex: 1 }}>
          <StudentStatus />
        </div>
      </div>
    </div>
  );
}

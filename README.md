# 🚦 Queue – Real-Time Mentorship Queue System

Queue is a real-time mentorship queue management platform designed for educational programs, bootcamps, and corporate training environments. It enables students to request help, mentors to manage tickets efficiently, and admins to track live analytics — all with instant, real-time updates.

---

## 🚀 Problem Statement
Managing 1-on-1 help sessions is often chaotic:
- Students don’t know when they’ll receive help
- Mentors may accidentally pick the same request
- Admins lack visibility into wait times and mentor performance

Queue solves this by providing a **centralized, real-time ticketing system** with role-based access.

---

## 🎯 Key Features

### 👩‍🎓 Student
- Submit a help request (ticket)
- View real-time ticket status:
  - Pending → In Progress → Resolved

### 🧑‍🏫 Mentor
- View live “Pending” queue
- Claim tickets atomically (no conflicts)
- Manage assigned tickets in “My Queue”

### 🧑‍💼 Admin
- View live analytics:
  - Average wait time
  - Average resolution time
  - Mentor performance leaderboard

---

## 🏗️ Architecture Overview
- **Frontend:** React (role-based dashboards)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-Time Communication:** Socket.io
- **Authentication & Security:** JWT + Role-Based Access Control

All ticket state changes are synchronized instantly across clients using WebSockets.

---

## ⚙️ Tech Stack
- React
- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT Authentication
- Role-Based Access Control (RBAC)

---

## 🔄 Real-Time Workflow
1. Student submits a ticket via REST API
2. Server emits `new_ticket` event to mentors
3. Mentor claims a ticket (atomic operation)
4. Server broadcasts `ticket_claimed` to all clients
5. Student UI updates instantly
6. Mentor resolves ticket → `ticket_resolved` event

---

## 🔐 Role-Based Access Control
- **Students:** Create and track tickets
- **Mentors:** Claim and resolve tickets
- **Admins:** View analytics only

RBAC is enforced at:
- API level (Express middleware)
- WebSocket event level
- Frontend UI rendering

---

## 📊 Analytics (Admin Dashboard)
- Average wait time
- Average resolution time
- Mentor efficiency metrics  
Powered by MongoDB aggregation pipelines and live Socket.io updates.

---

# Application Overview
Login Page
<img width="1917" height="1004" alt="image" src="https://github.com/user-attachments/assets/6bc25359-80f1-4489-a290-ff1848aae0c5" />

Admin Dashboard
<img width="1913" height="1016" alt="image" src="https://github.com/user-attachments/assets/aebc39e2-84ae-4a26-b4ec-3402af3aa223" />

Student Dashboard
<img width="1915" height="593" alt="image" src="https://github.com/user-attachments/assets/971a2d13-fc65-4833-bb12-c62ab7969854" />
<img width="1913" height="997" alt="image" src="https://github.com/user-attachments/assets/aaaf7a8e-73e4-45e7-ba81-d67526c5ebcb" />

Mentor Dashboard
<img width="1916" height="976" alt="image" src="https://github.com/user-attachments/assets/74805df7-055e-4ddb-80a5-159a59c6787e" />
<img width="1916" height="1009" alt="image" src="https://github.com/user-attachments/assets/8609bf99-b85a-45e5-8ab1-7de097581094" />
<img width="1919" height="894" alt="image" src="https://github.com/user-attachments/assets/4b2e7347-635c-41bc-b4e5-0fa69a7469bf" />








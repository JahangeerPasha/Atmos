# Atmos — Real-Time Team Wellness & Analytics Platform

Atmos is a real-time team wellness monitoring and analytics platform designed to improve team engagement, morale, and performance.  
It features **anonymous pulse checks**, **live dashboards**, **sentiment analytics**, and a **real-time Kudos/Q&A engine**.

---

## 🚀 Features

- 📊 **Live Wellness Dashboard** using React + Chart.js  
- 🔒 **Anonymous pulse check submissions**  
- ⚡ **Real-time updates** using Socket.io  
- 🎉 **Live Kudos feed** for instant appreciation  
- 🗨️ **Q&A engine with WebSocket rooms**  
- 🛡️ **Role-Based Access Control (RBAC)**  
  - Employee  
  - Manager  
  - Admin  
- 🧠 **Data aggregation & insights** (MongoDB queries + computed metrics)  
- 🏗️ Scalable backend built using Node.js & Express.js  

---

## 🧰 Tech Stack

**Frontend**
- React.js  
- Chart.js  
- Socket.io-client  
- JWT Authentication  

**Backend**
- Node.js  
- Express.js  
- Socket.io  
- JWT  
- Role-Based Access Control  

**Database**
- MongoDB (collections: users, wellness, kudos, questions)

**Architecture**
- REST APIs for CRUD + analytics  
- WebSocket channels for events  
- Modular services and controllers  

---

## 🏗️ System Flow

1. Employee submits an anonymous pulse check.  
2. Backend stores and aggregates the data.  
3. Admin/Manager dashboards update instantly via WebSockets.  
4. Kudos/Q&A messages broadcast across rooms.  
5. RBAC ensures secure and isolated access for each role.  

---

## 📦 Installation & Setup

```bash
git clone <repo-url>
cd atmos

npm install
npm run dev
```

Environment variables required:

```
MONGO_URI=
JWT_SECRET=
PORT=5000
```
# Application Overview
<img width="1917" height="1004" alt="image" src="https://github.com/user-attachments/assets/6bc25359-80f1-4489-a290-ff1848aae0c5" />



## 🔮 Future Enhancements
- AI-based sentiment scoring  
- Manager insights panel  
- Push notifications  
- Team-level trend predictions  



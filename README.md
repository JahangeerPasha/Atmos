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









## 🔮 Future Enhancements
- AI-based sentiment scoring  
- Manager insights panel  
- Push notifications  
- Team-level trend predictions  



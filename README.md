# Role-Based Smart Public Overcrowding Control System 🏙️

Welcome to the **Role-Based Smart Public Overcrowding Control System**. This is a full-stack web application designed for Smart City deployment to monitor, predict, and control public overcrowding using sparse sensor simulation, real-time analytics, and role-based access control (RBAC).

## ✨ Features
* **Role-Based Access Control (RBAC):** Super Admin, Control Team, and Public User views.
* **Real-time Monitoring:** Live zone density updates via WebSockets (`Socket.io`).
* **Intelligent Alerts:** Automated Red/Yellow alerts based on zone capacity thresholds.
* **Predictive Analytics:** On-the-fly linear regression predicting expected crowd surges up to 1-hour ahead.
* **Weather Intelligence:** Context-aware weather integration (OpenWeatherMap) assessing rain probability to impact expected crowds.
* **Aesthetic Dashboard:** Glassmorphism UI elements, smooth transitions, and dynamic SVGs.

## 🛠️ Tech Stack
* **Frontend:** React.js, Vite, TailwindCSS (v4 @tailwindcss/vite), Recharts, Socket.io-client, Lucide-React.
* **Backend:** Node.js, Express.js, MongoDB (Mongoose), Socket.io, JSON Web Tokens (JWT), bcrypt.

## 🚀 Getting Started

### 1. Prerequisites
* Node.js (v18+)
* MongoDB running locally (default: `mongodb://localhost:27017/overcrowding_db`)

### 2. Backend Setup
1. Open terminal and navigate to backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Configure `.env` (already contains defaults for local testing). If you want real weather, replace `WEATHER_API_KEY=dummykey` with a real OpenWeatherMap key.
4. Seed the database with mock zones and users: `node seed.js`
5. Start the server: `npm run dev` (Runs on http://localhost:5000)

### 3. Frontend Setup
1. Open a new terminal and navigate to frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev` (Runs on http://localhost:5173 by default)

### 4. Demo Accounts
Use the following accounts to explore different Role-Based dashboards:
* **Super Admin:** `admin@system.com` / `password123`
* **Control Team:** `control@system.com` / `password123`
* **Public User:** `public@system.com` / `password123`

## 🧠 System Architecture
1. **Sensors** `POST /api/sensors/simulate` sending entry/exit data.
2. **Backend Engine** calculates density, updates DB, triggers Alert logic, and emits WebSocket event.
3. **React Dashboard** instantly receives the WebSocket broadcast, updating the Zone Card colors, Heatmaps/Graphs, and triggering global alert banners based on role.

*Designed for seamless monitoring and maximum visual impact.*

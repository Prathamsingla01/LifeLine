# 🚑 LifeLine — Emergency Response Platform

Full-stack codebase implementing the architecture from Part 2.

## Project Structure

```
lifeline/
├── backend/                  Node.js + Express API
│   ├── server.js             Entry point (Express + Socket.io)
│   ├── config/
│   │   ├── supabase.js       Supabase client (service role)
│   │   ├── firebase.js       Firebase Admin SDK (FCM)
│   │   └── schema.sql        Full PostgreSQL schema + RLS
│   ├── middleware/
│   │   ├── auth.js           JWT verify + role guard
│   │   └── errorHandler.js   Global error handler
│   ├── routes/
│   │   ├── auth.js           Register / login / FCM token
│   │   ├── incidents.js      SOS dispatch lifecycle
│   │   ├── hospitals.js      Bed management
│   │   ├── ambulances.js     Fleet + GPS patches
│   │   ├── notifications.js  Broadcast + SMS
│   │   └── location.js       Directions + geocode
│   └── services/
│       ├── notificationService.js  FCM push → Twilio SMS fallback
│       └── locationService.js     Google Maps + nearest ambulance
│
├── frontend-dashboard/       React.js Admin Dashboard
│   └── src/
│       ├── lib/api.js        Axios + Supabase client
│       ├── hooks/useSocket.js Socket.io hook
│       ├── pages/Dashboard.jsx  Main dashboard page
│       └── components/
│           ├── StatsBar.jsx     KPI counters
│           ├── IncidentTable.jsx Live incident list
│           ├── HospitalPanel.jsx Bed availability
│           └── AmbulanceMap.jsx  Google Maps live tracking
│
└── mobile-app/               React Native (iOS + Android)
    └── src/
        ├── services/api.js            Axios client
        ├── services/locationService.js GPS tracker (10s push)
        └── screens/SOSScreen.jsx      Main paramedic screen
```

---

## ⚡ Quick Start

### 1. Supabase setup
1. Create a project at https://supabase.com
2. Go to SQL Editor → paste and run `backend/config/schema.sql`
3. Enable Realtime on `incidents`, `ambulances`, `hospitals` tables

### 2. Backend
```bash
cd backend
cp .env.example .env      # fill in all API keys
npm install
npm run dev               # starts on :5000 with nodemon
```

### 3. Admin Dashboard
```bash
cd frontend-dashboard
# Create .env with:
#   REACT_APP_SUPABASE_URL=...
#   REACT_APP_SUPABASE_ANON_KEY=...
#   REACT_APP_API_URL=http://localhost:5000/api
npm install
npm start                 # starts on :3000
```

### 4. Mobile App
```bash
cd mobile-app
# Edit src/services/api.js → set your backend IP
npm install
npx react-native run-android   # or run-ios
```

---

## 🔑 Environment Variables (Backend)

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (never expose client-side) |
| `JWT_SECRET` | Secret for signing internal JWTs |
| `FIREBASE_PROJECT_ID` | Firebase project for FCM |
| `FIREBASE_PRIVATE_KEY` | Service account private key |
| `FIREBASE_CLIENT_EMAIL` | Service account email |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Your Twilio SMS number |
| `GOOGLE_MAPS_API_KEY` | Enable Directions + Geocoding APIs |

---

## 🌊 Data Flow: SOS Alert

```
Mobile App (paramedic taps SOS)
  │  POST /api/incidents  { lat, lng, severity }
  ▼
Backend (incidents.js)
  │  1. Insert incident row → Supabase PostgreSQL
  │  2. Find nearest available ambulance (Haversine)
  │  3. Patch ambulance status → "dispatched"
  │  4. notificationService.sendToParamedic()
  │       → FCM push (online)  OR  Twilio SMS (offline)
  │  5. Socket.io emit → "admin" room
  ▼
Supabase Realtime
  │  Broadcasts INSERT to subscribed clients
  ▼
Admin Dashboard
     Updates incident table + map pin in real time
```

---

## 🔐 Auth Roles

| Role | Access |
|---|---|
| `admin` | All incidents, all hospitals, broadcast alerts |
| `hospital_staff` | Own hospital's incidents + bed management |
| `paramedic` | SOS trigger, own ambulance location push |
| `patient` | SOS trigger only |

---

## 📡 Real-time Architecture

Two complementary real-time layers run in parallel:

- **Socket.io** — low-latency server push for GPS positions and status changes (< 100ms)
- **Supabase Realtime** — PostgreSQL CDC for persistent data changes (incidents, beds) as a reliable fallback

GPS updates are sent every **10 seconds** from the mobile app via REST `PATCH /api/ambulances/:id/location`, then broadcast via Socket.io to the admin room without touching the database — keeping write load minimal.

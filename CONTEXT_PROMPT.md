# LifeLine — Complete Project Context Prompt

You are working on **LifeLine**, an AI-powered Emergency Response Platform built for a hackathon. Below is the complete description of the codebase, architecture, design system, and every file. Use this context to make accurate, consistent changes.

---

## 🎯 Project Overview

LifeLine is a real-time emergency response SaaS platform that detects accidents, dispatches ambulances, tracks family safety, and enables community fundraising. It's built as a **high-fidelity hackathon demo** with:

- Automatic crash detection (accelerometer simulation)
- Hospital dispatch with live map tracking
- Family member GPS tracking with geofences
- AI risk zone prediction maps
- Emergency QR code scanning for medical profiles
- Gamification (safety badges & scores)
- Real-time emergency feed
- Dark/Light theme toggle

**GitHub:** https://github.com/Prathamsingla01/LifeLine

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.4 |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS | v4 |
| Animations | Framer Motion | 12.38 |
| State Management | Zustand | 5.0.12 |
| Maps | Leaflet + react-leaflet | 1.9.4 / 5.0 |
| Icons | Lucide React | 1.11 |
| CSS Utilities | clsx, tailwind-merge | — |
| Language | TypeScript | 5.x |
| Backend (reference) | FastAPI (Python) | — |
| Realtime (reference) | Node.js + Socket.io | — |
| Database (reference) | PostgreSQL + PostGIS | — |

**Run command:** `cd lifeline-next && npm run dev` → opens at `http://localhost:3000`

---

## 📁 Complete File Structure

```
Code/                              ← Root project directory
├── lifeline-next/                 ← ⭐ MAIN NEXT.JS APP (all development here)
│   ├── package.json               ← Dependencies & scripts
│   ├── tsconfig.json              ← TypeScript config
│   ├── next.config.ts             ← Next.js config
│   ├── postcss.config.mjs         ← PostCSS + Tailwind
│   │
│   └── src/
│       ├── app/                   ← Next.js App Router pages
│       │   ├── layout.tsx         ← Root layout (Sidebar + MainContent + AIChatbot)
│       │   ├── page.tsx           ← Homepage (Globe hero, live map, features grid)
│       │   ├── globals.css        ← Global CSS (design tokens, animations, themes)
│       │   │
│       │   ├── dashboard/page.tsx ← Dashboard (stats, live feed, map, badges, QR)
│       │   ├── demo/page.tsx      ← Emergency Hub (SOS button, dispatch, safe-zone map, funds)
│       │   ├── accident/page.tsx  ← Accident Detection (6-stage phone mockup walkthrough)
│       │   ├── scenarios/page.tsx ← 4 Demo Scenarios (accident, flood, child, community)
│       │   ├── profile/page.tsx   ← Medical Profile (health data, QR scan, emergency share)
│       │   ├── family/page.tsx    ← Family Tracker (live map, 4 members, SOS broadcast)
│       │   ├── feed/page.tsx      ← Emergency Feed (real-time incident stream, filters)
│       │   ├── risk-map/page.tsx  ← AI Risk Map (prediction zones, time slots)
│       │   ├── architecture/page.tsx ← Tech Architecture (stack, API docs, DB schema)
│       │   ├── login/page.tsx     ← Auth (login/signup tabs, OTP, role selection)
│       │   ├── notifications/page.tsx ← Notifications (read/unread, severity filters)
│       │   ├── settings/page.tsx  ← Settings (profile edit, toggles, dark mode switch)
│       │   │
│       │   └── api/               ← Next.js API Routes
│       │       ├── emergency/route.ts  ← GET/POST emergencies (in-memory demo store)
│       │       └── auth/route.ts       ← POST login/register (simulated JWT)
│       │
│       ├── components/            ← Reusable React components
│       │   ├── layout/            ← Page structure components
│       │   │   ├── Sidebar.tsx    ← ⭐ Collapsible sidebar nav (4 sections, theme toggle)
│       │   │   ├── MainContent.tsx ← Client wrapper (adjusts padding for sidebar)
│       │   │   └── PageTransition.tsx ← Framer Motion blur+fade route transition
│       │   │
│       │   ├── features/          ← Domain-specific feature components
│       │   │   ├── Globe.tsx      ← Canvas 3D rotating globe with emergency dots
│       │   │   ├── QREmergency.tsx ← QR code generator + scan simulation + decode
│       │   │   └── GamificationBadges.tsx ← 8 safety badges with progress
│       │   │
│       │   ├── maps/              ← Mapping components
│       │   │   └── EmergencyMap.tsx ← Leaflet map (markers, routes, danger zones, ambulance)
│       │   │
│       │   ├── chat/              ← AI assistant
│       │   │   └── AIChatbot.tsx  ← Floating chat widget (bottom-right)
│       │   │
│       │   ├── ui/                ← Primitive UI components
│       │   │   ├── AnimatedNumber.tsx ← Counter animation (0 → target)
│       │   │   ├── Badge.tsx      ← Status badge (colored pill)
│       │   │   ├── Button.tsx     ← Button variants (primary, secondary, ghost, danger)
│       │   │   ├── Card.tsx       ← Glass card container
│       │   │   ├── Globe.tsx      ← (copy in ui/ — also exists in features/)
│       │   │   ├── QREmergency.tsx ← (copy in ui/ — also exists in features/)
│       │   │   └── GamificationBadges.tsx ← (copy in ui/ — also exists in features/)
│       │   │
│       │   ├── nav/               ← Old navbar (kept as backup, not used in layout)
│       │   │   └── Navbar.tsx
│       │   │
│       │   └── ai/                ← Old AI chatbot location (backup)
│       │       └── AIChatbot.tsx
│       │
│       └── lib/                   ← Shared utilities & stores
│           └── store.ts           ← Zustand stores (Auth, Notifications, Feed, Theme, Sidebar)
│
├── index.html                     ← Static landing page (original prototype)
├── lifeline.html                  ← Static app demo (SOS, dispatch, safe-zone, funds)
├── hackathon-demo.html            ← Static 4-scenario walkthrough
├── lifeline_accident_demo.html    ← Static accident flow
├── medical-profile.html           ← Static medical profile
├── family-tracker.html            ← Static family tracker
├── architecture.html              ← Static tech architecture
├── styles.css                     ← Shared CSS for static HTML pages
├── nav-component.js               ← Shared nav for static HTML pages
│
├── main.py                        ← FastAPI entry point
├── auth.py                        ← FastAPI auth (register/login, JWT, family groups)
├── models.py                      ← SQLAlchemy models (User, Family, Emergency, Fundraiser)
├── schemas.py                     ← Pydantic request/response schemas
├── emergencies.py                 ← Emergency endpoints
├── hospitals.py                   ← Hospital endpoints
├── fundraisers.py                 ← Fundraiser endpoints
├── auth_utils.py                  ← JWT helpers
├── schema.sql                     ← PostgreSQL schema v1 (with PostGIS)
├── schema2.O.sql                  ← PostgreSQL schema v2
├── server.js                      ← Node.js + Socket.io real-time server
├── requirements.txt               ← Python dependencies
├── Dashboard.jsx                  ← React Native dashboard component (reference)
└── SOSScreen.jsx                  ← React Native SOS screen (reference)
```

---

## 🎨 Design System

### Color Tokens (Tailwind v4 `@theme` — defined in `globals.css`)

```css
/* DARK THEME (default) */
--color-ll-bg: #070b11;         /* Page background */
--color-ll-bg2: #0c1018;        /* Alternate background */
--color-ll-surface: #111827;    /* Card backgrounds */
--color-ll-surface2: #1a2332;   /* Nested surfaces */
--color-ll-surface3: #1f2937;   /* Deepest surface */
--color-ll-border: rgba(255, 255, 255, 0.06);  /* Subtle borders */
--color-ll-border2: rgba(255, 255, 255, 0.1);  /* Hover borders */

/* Accent colors */
--color-ll-red: #ef4444;        /* Emergency, SOS, critical */
--color-ll-green: #22c55e;      /* Safe, success, hospitals */
--color-ll-blue: #3b82f6;       /* Ambulance, info, user markers */
--color-ll-amber: #f59e0b;      /* Warning, moderate severity */
--color-ll-purple: #a855f7;     /* Family, special features */
--color-ll-cyan: #06b6d4;       /* Tech, data, secondary info */

/* Text hierarchy */
--color-ll-text: #f1f5f9;       /* Primary text */
--color-ll-text2: #94a3b8;      /* Secondary text */
--color-ll-text3: #64748b;      /* Tertiary/labels */
--color-ll-text4: #334155;      /* Disabled/muted */

/* LIGHT THEME (when html has class "light") */
--color-ll-bg: #f8fafc;
--color-ll-surface: #ffffff;
--color-ll-text: #0f172a;
/* etc. — all tokens override in html.light {} */
```

### Typography
- **Sans:** Inter (Google Font, `--font-sans`)
- **Mono:** JetBrains Mono (Google Font, `--font-mono`)
- **Headings:** `font-extrabold tracking-tight`
- **Labels:** `font-mono text-[10px] tracking-[2px] uppercase text-ll-text3`

### Component Patterns
- **Cards:** `bg-ll-surface border border-ll-border rounded-2xl p-6`
- **Glass effect:** `.glass` class (backdrop-blur-md + semi-transparent bg)
- **Glow effects:** `.glow-red`, `.glow-blue`, `.glow-green` (box-shadow)
- **Hover:** Cards use `hover:-translate-y-1 hover:border-ll-border2`

### Animations (Framer Motion)
- **Page transitions:** `PageTransition.tsx` — blur(4px) + fade + y-slide
- **Stagger:** `container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }`
- **Item:** `item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }`
- All interactive elements use `whileHover={{ scale: 1.03 }}` and `whileTap={{ scale: 0.97 }}`

---

## 🧠 State Management (Zustand — `src/lib/store.ts`)

### 5 Stores:

1. **`useAuthStore`** — User session (id, name, email, role). Pre-loaded with demo user "Arjun Mehta".
2. **`useNotificationStore`** — Notifications array with `markRead()`, `markAllRead()`, `addNotification()`. Pre-loaded with 6 sample notifications.
3. **`useFeedStore`** — Emergency feed items with `addItem()`. Pre-loaded with 8 incidents.
4. **`useThemeStore`** — Dark/light mode toggle. Persists to `localStorage`. Adds/removes `light` class on `<html>`.
5. **`useSidebarStore`** — Sidebar open/closed state + collapsed/expanded state.

---

## 🗺 Routing (18 Routes)

| Route | Page | Description |
|---|---|---|
| `/` | Homepage | Hero with 3D Globe, typewriter text, live ticker, emergency map, feature cards, tech chips |
| `/dashboard` | Dashboard | 4 stat counters, live emergency feed, mini map, quick actions, safety score ring, gamification badges, QR card |
| `/demo` | Emergency Hub | 4-tab interface: SOS button (with circular progress), Hospital Dispatch, Safe-Zone Map (Leaflet with danger zones), Funds Transparency |
| `/accident` | Accident Detection | 6-stage phone mockup: Impact Detection → Safety Timer → Auto-SOS → Hospital Alert → Ambulance Dispatch → Medical Share |
| `/scenarios` | Demo Scenarios | 4 tabbed scenarios with step-by-step timelines: Accident Alert, Flood Response, Child Safety, Community Healing |
| `/profile` | Medical Profile | Full medical data display (personal info, blood/allergies, medications, conditions, insurance, emergency contacts), QR scan simulation, emergency share |
| `/family` | Family Tracker | Live Leaflet map with 4 family members, activity feed, SOS broadcast button |
| `/feed` | Emergency Feed | Real-time incident stream with auto-updates (setInterval), type/severity/status filters |
| `/risk-map` | AI Risk Map | Leaflet map with risk zone circles, time-of-day slot selector, risk level legend |
| `/architecture` | Tech Architecture | Data flow diagram, tech stack grid, API endpoint table, DB schema cards, code sample, real-time architecture, RBAC table |
| `/login` | Auth | Login/Signup tabs, email/password fields, OTP verification, role selector (User/Hospital/Admin) |
| `/notifications` | Notifications | Read/unread tabs, severity-based icons, mark-as-read, mark-all-read |
| `/settings` | Settings | Profile edit, privacy toggles, notification toggles, dark mode toggle (connected to theme store) |
| `/api/emergency` | API | GET: list 3 demo emergencies. POST: create new emergency (in-memory) |
| `/api/auth` | API | POST: login/register with demo mode (any credentials work) |

---

## 🧩 Key Components

### `Sidebar.tsx` (layout/)
- Fixed left sidebar on desktop (260px expanded, 72px collapsed)
- 4 sections: Main, Emergency, Safety, System
- Active page has red indicator bar + `layoutId` animation
- Theme toggle (Sun/Moon) at bottom
- User profile card at bottom
- Mobile: hamburger → drawer overlay with X close + bottom nav bar with SOS button

### `EmergencyMap.tsx` (maps/)
- Props: `markers`, `routes`, `dangerZones`, `center`, `zoom`, `height`, `interactive`, `showZoom`, `animateAmbulance`
- Marker types: `emergency` (🚨), `hospital` (🏥), `ambulance` (🚑), `user` (📍), `family` (👤), `danger` (⚠️)
- Each marker uses `L.divIcon` with custom HTML (glass effect, pulse rings)
- Danger zones render as `L.circle` with dashed borders
- `animateAmbulance` moves a marker along the first route using `requestAnimationFrame`
- Uses dark CartoDB tiles: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`

### `Globe.tsx` (features/)
- HTML Canvas-based 3D globe (no Three.js)
- 12 emergency dots positioned with `latLngTo3D()` math
- Cities: Delhi, Mumbai, Chennai, Kolkata, Bangalore, NYC, London, Tokyo, Sydney, Moscow, São Paulo, Singapore
- Pulse animation on critical dots
- Latitude/longitude grid lines
- 3 orbital ring divs animated with CSS `spin`

### `QREmergency.tsx` (features/)
- Generates 21x21 QR-like SVG pattern with finder patterns
- "Simulate Scan" button triggers red laser scan animation
- On scan complete, shows decoded medical profile (name, blood type, allergies, medications, insurance, LifeLine ID)

### `GamificationBadges.tsx` (features/)
- 8 badges: Profile Guardian, Family Sentinel, First Aid Hero, Community Star, Quick Responder, Zone Explorer, Safety Streak, LifeLine Veteran
- Earned badges show checkmark + full color; locked show progress bar
- `compact` prop for inline display (shows first 4 earned badges as small icons)

### `AIChatbot.tsx` (chat/)
- Floating button (bottom-right, above mobile nav)
- Opens chat panel with typing simulation
- Pre-configured responses for emergency queries

---

## 🔌 Backend (Reference — not running in demo)

### FastAPI (`main.py`, `auth.py`, `models.py`)
- `POST /api/v1/register` — Create user + family group
- `POST /api/v1/login` — JWT token
- `POST /api/v1/report-emergency` — Log emergency with PostGIS location
- `GET /api/v1/nearby-hospitals` — Geospatial query
- `POST /api/v1/fundraisers` — Create campaign

### Socket.io (`server.js`)
- Rooms: `ambulance:{id}`, `hospital:{id}`
- Events: `location-update`, `emergency-update`, `ambulance-assigned`

### Database (`schema.sql`)
- Tables: `users`, `families`, `emergencies`, `hospitals`, `ambulances`, `fundraisers`
- Uses PostGIS `GEOGRAPHY(POINT, 4326)` for spatial queries
- RBAC roles: `admin`, `hospital_staff`, `paramedic`, `patient`

---

## ⚠️ Important Conventions

1. **All pages are client components** — `"use client"` at top of every page
2. **Leaflet maps must be dynamically imported** — `const Map = dynamic(() => import(...), { ssr: false })` to avoid SSR crashes
3. **Animation pattern** — Every page wraps content in `<motion.div variants={container}>` with staggered `<motion.div variants={item}>` children
4. **Color usage** — Always use Tailwind tokens: `text-ll-red`, `bg-ll-surface`, `border-ll-border`. Never use raw hex in JSX.
5. **Typography pattern** — Section headers use: `<div className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">LABEL</div>`
6. **Card pattern** — `<div className="bg-ll-surface border border-ll-border rounded-2xl p-6">`
7. **Imports** — Feature components from `@/components/features/`, UI from `@/components/ui/`, layout from `@/components/layout/`
8. **Theme** — Dark is default. Light mode activated by adding `light` class to `<html>`. All theme-aware styles use CSS variable overrides in `html.light {}`.
9. **Mobile** — Bottom nav bar on mobile (5 items + SOS button). Sidebar hidden behind hamburger drawer.

---

## 🚀 Quick Reference Commands

```bash
# Install dependencies
cd lifeline-next && npm install

# Run dev server
npm run dev                    # → http://localhost:3000

# Build for production
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

---

## 💡 When Making Changes

- Keep the dark glassmorphism aesthetic
- Use Framer Motion for all new animations (stagger pattern)
- Add `"use client"` to any component using hooks, state, or browser APIs
- Dynamic-import any Leaflet/map components
- Use the existing Zustand stores for state; add new stores in `store.ts`
- Test both dark and light themes
- Ensure mobile responsiveness (sidebar drawer + bottom nav)
- After changes, run `npm run build` to verify no TypeScript errors

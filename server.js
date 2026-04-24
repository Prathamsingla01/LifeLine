// ──────────────────────────────────────────────────────────────
//  LifeLine Backend  ·  server.js
//  Node.js + Express + Socket.io
// ──────────────────────────────────────────────────────────────
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// ── Route imports ─────────────────────────────────────────────
const authRoutes       = require("./routes/auth");
const incidentRoutes   = require("./routes/incidents");
const hospitalRoutes   = require("./routes/hospitals");
const ambulanceRoutes  = require("./routes/ambulances");
const notifyRoutes     = require("./routes/notifications");
const locationRoutes   = require("./routes/location");

// ── Middleware imports ────────────────────────────────────────
const { verifyToken } = require("./middleware/auth");
const { errorHandler } = require("./middleware/errorHandler");

const app    = express();
const server = http.createServer(app);

// ── Socket.io (Supabase Realtime bridge) ─────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Attach io to app so routes can emit events
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Paramedic joins a room keyed to their ambulance ID
  socket.on("join:ambulance", (ambulanceId) => {
    socket.join(`ambulance:${ambulanceId}`);
    console.log(`  ↳ Joined room ambulance:${ambulanceId}`);
  });

  // Hospital dashboard joins its own room
  socket.on("join:hospital", (hospitalId) => {
    socket.join(`hospital:${hospitalId}`);
    console.log(`  ↳ Joined room hospital:${hospitalId}`);
  });

  // Admin joins global broadcast room
  socket.on("join:admin", () => {
    socket.join("admin");
    console.log(`  ↳ Joined room admin`);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// ── Core Middleware ───────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global rate limiter — 100 req / 15 min per IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many requests, please try again later." },
  })
);

// ── Health check ──────────────────────────────────────────────
app.get("/health", (_req, res) =>
  res.json({ status: "ok", service: "LifeLine API", uptime: process.uptime() })
);

// ── API Routes ────────────────────────────────────────────────
app.use("/api/auth",         authRoutes);
app.use("/api/incidents",    verifyToken, incidentRoutes);
app.use("/api/hospitals",    verifyToken, hospitalRoutes);
app.use("/api/ambulances",   verifyToken, ambulanceRoutes);
app.use("/api/notifications",verifyToken, notifyRoutes);
app.use("/api/location",     verifyToken, locationRoutes);

// ── Global error handler ──────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚑 LifeLine API running on port ${PORT}`);
  console.log(`   ENV : ${process.env.NODE_ENV}`);
  console.log(`   WS  : Socket.io ready\n`);
});

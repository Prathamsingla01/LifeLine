// src/pages/Dashboard.jsx
// ──────────────────────────────────────────────────────────────
//  LifeLine Admin Dashboard
//  Real-time incidents, ambulance fleet, hospital beds
// ──────────────────────────────────────────────────────────────
import React, { useEffect, useState, useCallback } from "react";
import api, { supabase } from "../lib/api";
import { useSocket } from "../hooks/useSocket";
import IncidentTable  from "../components/IncidentTable";
import AmbulanceMap   from "../components/AmbulanceMap";
import HospitalPanel  from "../components/HospitalPanel";
import StatsBar       from "../components/StatsBar";

export default function Dashboard() {
  const [incidents,   setIncidents]   = useState([]);
  const [ambulances,  setAmbulances]  = useState([]);
  const [hospitals,   setHospitals]   = useState([]);
  const [loading,     setLoading]     = useState(true);

  const { joinRoom, on } = useSocket();

  // ── Initial data fetch ──────────────────────────────────────
  useEffect(() => {
    async function load() {
      const [inc, amb, hosp] = await Promise.all([
        api.get("/incidents"),
        api.get("/ambulances"),
        api.get("/hospitals"),
      ]);
      setIncidents(inc.data);
      setAmbulances(amb.data);
      setHospitals(hosp.data);
      setLoading(false);
    }
    load();
    joinRoom("join:admin");
  }, [joinRoom]);

  // ── Socket.io real-time handlers ────────────────────────────
  useEffect(() => {
    const cleanups = [
      on("incident:new", (inc) => {
        setIncidents((prev) => [inc, ...prev]);
      }),
      on("incident:updated", (inc) => {
        setIncidents((prev) => prev.map((i) => (i.id === inc.id ? inc : i)));
      }),
      on("ambulance:location", ({ id, latitude, longitude, speed }) => {
        setAmbulances((prev) =>
          prev.map((a) => (a.id === id ? { ...a, latitude, longitude, speed } : a))
        );
      }),
      on("ambulance:status", ({ id, status }) => {
        setAmbulances((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        );
      }),
      on("hospital:beds_updated", (hosp) => {
        setHospitals((prev) => prev.map((h) => (h.id === hosp.id ? hosp : h)));
      }),
    ];
    return () => cleanups.forEach((fn) => fn());
  }, [on]);

  // ── Supabase Realtime (secondary, belt-and-suspenders) ──────
  useEffect(() => {
    const channel = supabase
      .channel("db-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "incidents" },
        (payload) => setIncidents((prev) => [payload.new, ...prev])
      )
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "incidents" },
        (payload) => setIncidents((prev) =>
          prev.map((i) => (i.id === payload.new.id ? payload.new : i))
        )
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const updateIncidentStatus = useCallback(async (id, status) => {
    await api.patch(`/incidents/${id}/status`, { status });
  }, []);

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <p>Loading LifeLine dashboard…</p>
      </div>
    );
  }

  const activeIncidents = incidents.filter(
    (i) => !["resolved", "cancelled"].includes(i.status)
  );

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <span style={styles.logo}>🚑 LifeLine</span>
        <span style={styles.subtitle}>Emergency Command Centre</span>
        <span style={styles.live}>● LIVE</span>
      </header>

      <StatsBar
        incidents={incidents}
        ambulances={ambulances}
        hospitals={hospitals}
      />

      <div style={styles.grid}>
        {/* Left column: map */}
        <div style={styles.mapCol}>
          <AmbulanceMap ambulances={ambulances} incidents={activeIncidents} />
        </div>

        {/* Right column: incidents + hospitals */}
        <div style={styles.rightCol}>
          <IncidentTable
            incidents={activeIncidents}
            onStatusChange={updateIncidentStatus}
          />
          <HospitalPanel hospitals={hospitals} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:     { minHeight: "100vh", background: "#0f1117", color: "#e2e8f0", fontFamily: "system-ui, sans-serif" },
  header:   { display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", borderBottom: "1px solid #1e2530" },
  logo:     { fontSize: 22, fontWeight: 700 },
  subtitle: { color: "#64748b", fontSize: 14, marginLeft: 8 },
  live:     { marginLeft: "auto", color: "#22c55e", fontSize: 12, fontWeight: 600, letterSpacing: 1 },
  grid:     { display: "grid", gridTemplateColumns: "1fr 420px", gap: 0, height: "calc(100vh - 120px)" },
  mapCol:   { position: "relative" },
  rightCol: { borderLeft: "1px solid #1e2530", overflowY: "auto", display: "flex", flexDirection: "column" },
  loading:  { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 16, color: "#94a3b8" },
  spinner:  { width: 40, height: 40, border: "3px solid #1e2530", borderTop: "3px solid #ef4444", borderRadius: "50%", animation: "spin 1s linear infinite" },
};

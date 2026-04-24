// src/screens/SOSScreen.jsx  ·  React Native
// ──────────────────────────────────────────────────────────────
//  Main screen for paramedics:
//   • Big SOS button to report an emergency
//   • Live map showing their current position
//   • Status toggle (available / busy)
// ──────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, SafeAreaView, ScrollView
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import api from "../services/api";
import locationTracker from "../services/locationService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SOSScreen() {
  const [position,       setPosition]       = useState(null);
  const [activeIncident, setActiveIncident] = useState(null);
  const [ambulanceId,    setAmbulanceId]    = useState(null);
  const [status,         setStatus]         = useState("available");
  const [sending,        setSending]        = useState(false);
  const [route,          setRoute]          = useState(null);

  // ── Bootstrap ───────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      const ambId = await AsyncStorage.getItem("ll_ambulance_id");
      if (ambId) setAmbulanceId(ambId);

      // Get initial position
      try {
        const coords = await locationTracker.getCurrentPosition();
        setPosition(coords);
      } catch { /* permission denied handled by service */ }

      // Start GPS push loop
      if (ambId) {
        locationTracker.start(ambId).catch(console.warn);
      }
    }
    init();
    return () => locationTracker.stop();
  }, []);

  // ── Trigger SOS ─────────────────────────────────────────────
  const triggerSOS = useCallback(async () => {
    if (!position) {
      Alert.alert("No GPS signal", "Please enable location services.");
      return;
    }

    Alert.alert(
      "🚨 Confirm SOS",
      "Report emergency at your current location?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "CONFIRM SOS", style: "destructive",
          onPress: async () => {
            setSending(true);
            try {
              const { data } = await api.post("/incidents", {
                latitude:    position.latitude,
                longitude:   position.longitude,
                description: "SOS from paramedic unit",
                severity:    "high",
              });
              setActiveIncident(data.incident);
              Alert.alert("✅ Dispatched", "Emergency reported. Stay on scene.");
            } catch (err) {
              Alert.alert("Error", err.message);
            } finally {
              setSending(false);
            }
          },
        },
      ]
    );
  }, [position]);

  // ── Toggle ambulance status ─────────────────────────────────
  const toggleStatus = useCallback(async () => {
    const next = status === "available" ? "offline" : "available";
    try {
      await api.patch(`/ambulances/${ambulanceId}/status`, { status: next });
      setStatus(next);
    } catch (err) {
      Alert.alert("Error updating status", err.message);
    }
  }, [ambulanceId, status]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Map */}
      <View style={styles.mapContainer}>
        {position ? (
          <MapView
            style={styles.map}
            region={{
              latitude:       position.latitude,
              longitude:      position.longitude,
              latitudeDelta:  0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation
            followsUserLocation
          >
            {activeIncident && (
              <Marker
                coordinate={{ latitude: activeIncident.latitude, longitude: activeIncident.longitude }}
                title="Active Incident"
                pinColor="red"
              />
            )}
            {route && <Polyline coordinates={route} strokeColor="#ef4444" strokeWidth={3} />}
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <ActivityIndicator color="#ef4444" size="large" />
            <Text style={styles.gpsText}>Acquiring GPS…</Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <ScrollView style={styles.panel} contentContainerStyle={{ gap: 12 }}>
        {/* Active incident banner */}
        {activeIncident && (
          <View style={styles.incidentBanner}>
            <Text style={styles.bannerTitle}>🚨 ACTIVE DISPATCH</Text>
            <Text style={styles.bannerText}>{activeIncident.description}</Text>
            <Text style={styles.bannerMeta}>
              Status: {activeIncident.status?.replace("_", " ").toUpperCase()}
            </Text>
          </View>
        )}

        {/* SOS Button */}
        <TouchableOpacity
          style={[styles.sosBtn, sending && styles.sosBtnDisabled]}
          onPress={triggerSOS}
          disabled={sending}
          activeOpacity={0.8}
        >
          {sending
            ? <ActivityIndicator color="#fff" size="large" />
            : <Text style={styles.sosBtnText}>🚨 SOS</Text>
          }
        </TouchableOpacity>

        {/* Status toggle */}
        <TouchableOpacity
          style={[styles.statusBtn, { borderColor: status === "available" ? "#22c55e" : "#64748b" }]}
          onPress={toggleStatus}
        >
          <Text style={[styles.statusText, { color: status === "available" ? "#22c55e" : "#64748b" }]}>
            {status === "available" ? "● AVAILABLE" : "○ OFFLINE"}
          </Text>
        </TouchableOpacity>

        {/* GPS readout */}
        {position && (
          <View style={styles.gpsCard}>
            <Text style={styles.gpsLabel}>GPS POSITION</Text>
            <Text style={styles.gpsValue}>
              {position.latitude.toFixed(5)}, {position.longitude.toFixed(5)}
            </Text>
            {position.speed != null && (
              <Text style={styles.gpsMeta}>{(position.speed * 3.6).toFixed(0)} km/h</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: "#0f1117" },
  mapContainer:    { flex: 1 },
  map:             { width: "100%", height: "100%" },
  mapPlaceholder:  { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  gpsText:         { color: "#64748b", fontSize: 14 },
  panel:           { maxHeight: 320, padding: 16 },
  sosBtn:          { backgroundColor: "#ef4444", borderRadius: 16, height: 80, alignItems: "center", justifyContent: "center" },
  sosBtnDisabled:  { opacity: 0.6 },
  sosBtnText:      { color: "#fff", fontSize: 28, fontWeight: "900", letterSpacing: 2 },
  statusBtn:       { borderWidth: 1.5, borderRadius: 12, padding: 14, alignItems: "center" },
  statusText:      { fontSize: 14, fontWeight: "700", letterSpacing: 1 },
  gpsCard:         { backgroundColor: "#161b27", borderRadius: 12, padding: 12, gap: 2 },
  gpsLabel:        { fontSize: 10, color: "#64748b", letterSpacing: 0.5 },
  gpsValue:        { fontSize: 13, color: "#94a3b8", fontFamily: "monospace" },
  gpsMeta:         { fontSize: 11, color: "#475569" },
  incidentBanner:  { backgroundColor: "#ef444422", borderWidth: 1, borderColor: "#ef4444", borderRadius: 12, padding: 12, gap: 4 },
  bannerTitle:     { color: "#ef4444", fontWeight: "700", fontSize: 13, letterSpacing: 0.5 },
  bannerText:      { color: "#e2e8f0", fontSize: 13 },
  bannerMeta:      { color: "#64748b", fontSize: 11 },
});

"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* 3D CSS Globe with emergency signals — lightweight, no Three.js */

interface EmergencyDot {
  lat: number;
  lng: number;
  color: string;
  pulse?: boolean;
  label?: string;
}

const emergencyDots: EmergencyDot[] = [
  { lat: 28.6, lng: 77.2, color: "#ef4444", pulse: true, label: "Delhi" },
  { lat: 19.0, lng: 72.8, color: "#ef4444", pulse: true, label: "Mumbai" },
  { lat: 13.0, lng: 80.2, color: "#f59e0b", label: "Chennai" },
  { lat: 22.5, lng: 88.3, color: "#3b82f6", label: "Kolkata" },
  { lat: 12.9, lng: 77.5, color: "#22c55e", label: "Bangalore" },
  { lat: 40.7, lng: -74.0, color: "#a855f7", label: "NYC" },
  { lat: 51.5, lng: -0.1, color: "#06b6d4", label: "London" },
  { lat: 35.6, lng: 139.7, color: "#f59e0b", pulse: true, label: "Tokyo" },
  { lat: -33.8, lng: 151.2, color: "#3b82f6", label: "Sydney" },
  { lat: 55.7, lng: 37.6, color: "#ef4444", label: "Moscow" },
  { lat: -23.5, lng: -46.6, color: "#22c55e", label: "São Paulo" },
  { lat: 1.3, lng: 103.8, color: "#06b6d4", label: "Singapore" },
];

function latLngTo3D(lat: number, lng: number, radius: number, rotation: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + rotation) * Math.PI) / 180;
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return { x, y, z };
}

export function Globe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 400;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const globeRadius = 150;

    function draw() {
      ctx!.clearRect(0, 0, size, size);
      const rotation = rotationRef.current;

      // Globe body — gradient sphere
      const grad = ctx!.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, globeRadius);
      grad.addColorStop(0, "rgba(30, 41, 59, 0.8)");
      grad.addColorStop(0.6, "rgba(17, 24, 39, 0.9)");
      grad.addColorStop(1, "rgba(7, 11, 17, 0.95)");
      ctx!.beginPath();
      ctx!.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx!.fillStyle = grad;
      ctx!.fill();

      // Globe border glow
      ctx!.beginPath();
      ctx!.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx!.strokeStyle = "rgba(239, 68, 68, 0.15)";
      ctx!.lineWidth = 2;
      ctx!.stroke();

      // Atmosphere glow
      const atmoGrad = ctx!.createRadialGradient(cx, cy, globeRadius - 10, cx, cy, globeRadius + 30);
      atmoGrad.addColorStop(0, "transparent");
      atmoGrad.addColorStop(0.5, "rgba(239, 68, 68, 0.05)");
      atmoGrad.addColorStop(1, "transparent");
      ctx!.beginPath();
      ctx!.arc(cx, cy, globeRadius + 30, 0, Math.PI * 2);
      ctx!.fillStyle = atmoGrad;
      ctx!.fill();

      // Grid lines (latitude)
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx!.beginPath();
        const r = globeRadius * Math.cos((lat * Math.PI) / 180);
        const yOff = globeRadius * Math.sin((lat * Math.PI) / 180);
        ctx!.ellipse(cx, cy - yOff, r, r * 0.3, 0, 0, Math.PI * 2);
        ctx!.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
      }

      // Grid lines (longitude)
      for (let lng = 0; lng < 180; lng += 30) {
        ctx!.beginPath();
        const angle = ((lng + rotation) * Math.PI) / 180;
        ctx!.ellipse(cx, cy, globeRadius * Math.abs(Math.cos(angle)), globeRadius, 0, 0, Math.PI * 2);
        ctx!.strokeStyle = "rgba(255, 255, 255, 0.03)";
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
      }

      // Emergency dots
      const now = Date.now();
      emergencyDots.forEach((dot) => {
        const pos = latLngTo3D(dot.lat, dot.lng, globeRadius, rotation);
        if (pos.z < 0) return; // behind globe

        const screenX = cx + pos.x;
        const screenY = cy - pos.y;
        const scale = (pos.z + globeRadius) / (2 * globeRadius);
        const dotSize = 3 + scale * 4;
        const alpha = 0.3 + scale * 0.7;

        // Pulse ring
        if (dot.pulse) {
          const pulsePhase = ((now / 1000) % 2) / 2;
          const pulseSize = dotSize + pulsePhase * 20;
          const pulseAlpha = (1 - pulsePhase) * 0.3 * alpha;
          ctx!.beginPath();
          ctx!.arc(screenX, screenY, pulseSize, 0, Math.PI * 2);
          ctx!.strokeStyle = dot.color.replace(")", `,${pulseAlpha})`).replace("rgb", "rgba");
          ctx!.lineWidth = 1.5;
          ctx!.stroke();
        }

        // Dot glow
        const glowGrad = ctx!.createRadialGradient(screenX, screenY, 0, screenX, screenY, dotSize * 3);
        glowGrad.addColorStop(0, dot.color + Math.round(alpha * 40).toString(16).padStart(2, "0"));
        glowGrad.addColorStop(1, "transparent");
        ctx!.beginPath();
        ctx!.arc(screenX, screenY, dotSize * 3, 0, Math.PI * 2);
        ctx!.fillStyle = glowGrad;
        ctx!.fill();

        // Dot
        ctx!.beginPath();
        ctx!.arc(screenX, screenY, dotSize, 0, Math.PI * 2);
        ctx!.fillStyle = dot.color;
        ctx!.globalAlpha = alpha;
        ctx!.fill();
        ctx!.globalAlpha = 1;
      });

      rotationRef.current += 0.15;
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Orbital rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="absolute w-[340px] h-[340px] rounded-full border border-ll-red/10"
          style={{ animation: "spin 20s linear infinite" }}
        />
        <div
          className="absolute w-[380px] h-[380px] rounded-full border border-ll-blue/8"
          style={{ animation: "spin 30s linear infinite reverse" }}
        />
        <div
          className="absolute w-[420px] h-[420px] rounded-full border border-ll-green/5"
          style={{ animation: "spin 40s linear infinite" }}
        />
      </div>

      <canvas
        ref={canvasRef}
        className="relative z-10"
        style={{ width: 400, height: 400 }}
      />

      {/* SOS pulse waves emanating from globe */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[300px] h-[300px] rounded-full border-2 border-ll-red/20 sos-ring-1" />
        <div className="absolute w-[300px] h-[300px] rounded-full border border-ll-red/15 sos-ring-2" />
        <div className="absolute w-[300px] h-[300px] rounded-full border border-ll-red/10 sos-ring-3" />
      </div>
    </motion.div>
  );
}

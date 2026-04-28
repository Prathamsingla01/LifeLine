import axios from "axios";

/**
 * Axios instance for FastAPI backend calls.
 * Uses NEXT_PUBLIC_API_BASE_URL from env, falls back to localhost:8000.
 */
const FASTAPI_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export const backendApi = axios.create({
  baseURL: FASTAPI_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token from cookie to requests
backendApi.interceptors.request.use((config) => {
  // In browser context, cookies are sent automatically
  // For server-side, we'd need to forward cookies manually
  return config;
});

/**
 * Helper to check if the FastAPI backend is reachable.
 */
export async function isBackendAvailable(): Promise<boolean> {
  try {
    const res = await backendApi.get("/health", { timeout: 3000 });
    return res.status === 200;
  } catch {
    return false;
  }
}

/**
 * Backend API endpoints mapping for the frontend.
 */
export const endpoints = {
  // Auth
  login: "/login",
  register: "/register",
  
  // Emergencies
  reportEmergency: "/report-emergency",
  listEmergencies: "/emergencies",
  updateEmergencyStatus: (id: string) => `/emergencies/${id}/status`,
  
  // Hospitals
  nearbyHospitals: "/nearby-hospitals",
  
  // Fundraisers
  listFundraisers: "/fundraisers",
  createFundraiser: "/fundraisers",
  getFundraiser: (id: string) => `/fundraisers/${id}`,
} as const;

// lib/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

// set auth token globally
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

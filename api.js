const BASE = "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  getMe: () => request("/auth/me"),
  submitDiscovery: (body) => request("/discovery/submit", { method: "POST", body: JSON.stringify(body) }),
  getDashboard: () => request("/dashboard"),
  getStrategy: () => request("/strategy"),
  simulate: (body) => request("/simulator/calculate", { method: "POST", body: JSON.stringify(body) }),
  getCoachHistory: () => request("/coach/history"),
  sendCoachMessage: (message) => request("/coach/message", { method: "POST", body: JSON.stringify({ message }) }),
  clearCoachHistory: () => request("/coach/history", { method: "DELETE" }),
  getAnalytics: () => request("/analytics"),
  getProfile: () => request("/profile"),
};
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);

require("./db");

const authRoutes = require("./routes/auth");
const discoveryRoutes = require("./routes/discovery");
const dashboardRoutes = require("./routes/dashboard");
const strategyRoutes = require("./routes/strategy");
const simulatorRoutes = require("./routes/simulator");
const coachRoutes = require("./routes/coach");
const analyticsRoutes = require("./routes/analytics");
const profileRoutes = require("./routes/profile");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use(session({
  store: new SQLiteStore({ db: "sessions.db", dir: __dirname }),
  secret: process.env.SESSION_SECRET || "finpath-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  },
}));

app.use("/api/auth", authRoutes);
app.use("/api/discovery", discoveryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/strategy", strategyRoutes);
app.use("/api/simulator", simulatorRoutes);
app.use("/api/coach", coachRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/profile", profileRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`FinPath backend running on http://localhost:${PORT}`);
});
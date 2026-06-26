const express = require("express");
const db = require("../db");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  const userId = req.session.userId;

  const user = db.prepare("SELECT id, first_name, last_name, email, username, country FROM users WHERE id = ?").get(userId);
  const profile = db.prepare("SELECT * FROM financial_profiles WHERE user_id = ?").get(userId);
  const goal = db.prepare("SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").get(userId);

  if (!user) return res.status(404).json({ error: "User not found" });

  return res.json({
    personal: {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: profile?.age || null,
      occupation: profile?.employment_status || null,
      country: user.country,
      username: user.username,
    },
    financial: {
      risk_profile: profile?.risk_tolerance || null,
      investment_horizon: profile?.investment_horizon || null,
      primary_goal: goal?.goal_name || null,
      monthly_savings: profile?.monthly_savings || null,
      annual_income: profile?.annual_income || null,
      monthly_expenses: profile?.monthly_expenses || null,
      emergency_fund: profile?.emergency_fund_status || null,
    },
    health_score: profile?.health_score || 0,
    segment: profile?.segment || null,
  });
});

module.exports = router;
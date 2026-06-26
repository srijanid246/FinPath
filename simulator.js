const express = require("express");
const db = require("../db");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.post("/calculate", requireAuth, (req, res) => {
  const { monthly_investment, timeline_years, risk_level } = req.body;

  if (!monthly_investment || !timeline_years || !risk_level) {
    return res.status(400).json({ error: "monthly_investment, timeline_years and risk_level are required" });
  }

  const goal = db
    .prepare("SELECT target_amount, target_year FROM goals WHERE user_id = ? ORDER BY created_at DESC LIMIT 1")
    .get(req.session.userId);

  const target_amount = goal ? goal.target_amount : 1000000;

  const rateMap = {
    Low: 0.07,
    Moderate: 0.10,
    High: 0.13,
  };

  const annualRate = rateMap[risk_level] || 0.10;
  const r = annualRate / 12;
  const n = parseInt(timeline_years) * 12;
  const mi = parseFloat(monthly_investment);

  const projectedWealth = r > 0
    ? mi * ((Math.pow(1 + r, n) - 1) / r)
    : mi * n;

  const rounded = Math.round(projectedWealth);

  const ratio = projectedWealth / target_amount;
  let successProbability;
  if (ratio >= 1.3) successProbability = 95;
  else if (ratio >= 1.1) successProbability = 85;
  else if (ratio >= 1.0) successProbability = 75;
  else if (ratio >= 0.8) successProbability = 60;
  else if (ratio >= 0.6) successProbability = 45;
  else successProbability = Math.max(Math.round(ratio * 50), 5);

  const goalAchievementYear = new Date().getFullYear() + parseInt(timeline_years);

  return res.json({
    projected_wealth: rounded,
    success_probability: successProbability,
    goal_achievement_year: goalAchievementYear,
    target_amount,
    goal_name: goal ? goal.goal_name : null,
    target_year: goal ? goal.target_year : null,
  });
});

module.exports = router;
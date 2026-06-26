const express = require("express");
const db = require("../db");
const requireAuth = require("../middleware/auth");
const { generateStrategyInsights } = require("../services/aiService");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const userId = req.session.userId;

  const strategy = db
    .prepare("SELECT * FROM strategies WHERE user_id = ? ORDER BY generated_at DESC LIMIT 1")
    .get(userId);

  if (!strategy) {
    return res.status(404).json({ error: "No strategy found. Please complete financial discovery first." });
  }

  const goal = db.prepare("SELECT * FROM goals WHERE id = ?").get(strategy.goal_id);
  const profile = db.prepare("SELECT * FROM financial_profiles WHERE user_id = ?").get(userId);

  let allocation = {};
  try { allocation = JSON.parse(strategy.allocation); } catch (_) {}

  const monthlySavings = profile.monthly_savings || 0;
  const monthlyNeeded = strategy.monthly_contribution || 0;
  const suggestedSavings = Math.ceil(
    (monthlySavings + Math.max(monthlyNeeded - monthlySavings, 0)) / 500
  ) * 500;

  const years = profile.investment_horizon || 10;
  const r = 0.10 / 12;
  const n = years * 12;
  const fvCurrent = Math.round(monthlySavings * ((Math.pow(1 + r, n) - 1) / r));
  const fvSuggested = Math.round(suggestedSavings * ((Math.pow(1 + r, n) - 1) / r));

  const currentYear = new Date().getFullYear();
  const goalYear = goal ? goal.target_year : currentYear + years;
  const improvedYear = Math.max(goalYear - 2, currentYear + 1);

  let aiInsights;
  if (profile.ai_strategy_insights) {
    try { aiInsights = JSON.parse(profile.ai_strategy_insights); } catch (_) {}
  }
  if (!aiInsights) {
    aiInsights = await generateStrategyInsights(profile, goal, strategy);
    db.prepare("UPDATE financial_profiles SET ai_strategy_insights=? WHERE user_id=?")
      .run(JSON.stringify(aiInsights), userId);
  }

  return res.json({
    strategy: {
      allocation,
      monthly_contribution: strategy.monthly_contribution,
      success_probability: strategy.success_probability,
      next_best_action: strategy.next_best_action,
      priority_actions: aiInsights.priority_actions,
    },
    goal: goal || null,
    current_monthly_savings: monthlySavings,
    suggested_monthly_savings: suggestedSavings,
    outcomes: {
      current_success: strategy.success_probability,
      improved_success: Math.min(strategy.success_probability + 13, 95),
      current_wealth: fvCurrent,
      improved_wealth: fvSuggested,
      current_goal_year: goalYear,
      improved_goal_year: improvedYear,
    },
    reasons: aiInsights.why_strategy,
  });
});

module.exports = router;
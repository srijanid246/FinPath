const express = require("express");
const db = require("../db");
const requireAuth = require("../middleware/auth");
const { generateDashboardInsights, generatePortfolioAllocation } = require("../services/aiService");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const userId = req.session.userId;

  const user = db.prepare("SELECT first_name, last_name FROM users WHERE id = ?").get(userId);
  const profile = db.prepare("SELECT * FROM financial_profiles WHERE user_id = ?").get(userId);

  if (!profile) {
    return res.status(404).json({ error: "Profile not found. Please complete financial discovery." });
  }

  const goal = db.prepare("SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").get(userId);
  const strategy = db.prepare("SELECT * FROM strategies WHERE user_id = ? ORDER BY generated_at DESC LIMIT 1").get(userId);

  let aiInsights;
  if (profile.ai_wealth_brief && profile.ai_strategy_summary) {
    aiInsights = {
      wealth_brief: profile.ai_wealth_brief,
      strategy_summary: profile.ai_strategy_summary,
    };
  } else {
    aiInsights = await generateDashboardInsights(
      { ...profile, first_name: user.first_name },
      goal,
      strategy
    );
    db.prepare("UPDATE financial_profiles SET ai_wealth_brief=?, ai_strategy_summary=? WHERE user_id=?")
      .run(aiInsights.wealth_brief, aiInsights.strategy_summary, userId);
  }

  let allocation;
  if (profile.ai_portfolio) {
    try { allocation = JSON.parse(profile.ai_portfolio); } catch (_) {}
  } else {
    allocation = await generatePortfolioAllocation(profile, goal);
    db.prepare("UPDATE financial_profiles SET ai_portfolio=? WHERE user_id=?")
      .run(JSON.stringify(allocation), userId);
  }

  let goalProgress = 0;
  if (goal) {
    const monthsElapsed = Math.max(
      (new Date().getFullYear() - new Date(goal.created_at).getFullYear()) * 12 +
      (new Date().getMonth() - new Date(goal.created_at).getMonth()), 0
    );
    const contributed = (profile.monthly_savings || 0) * monthsElapsed;
    goalProgress = Math.min(Math.round((contributed / goal.target_amount) * 100), 100);
  }

  return res.json({
    user: { first_name: user.first_name, last_name: user.last_name },
    health_score: profile.health_score,
    goal_success_probability: strategy ? strategy.success_probability : 0,
    risk_profile: profile.risk_tolerance || "Moderate",
    segment: profile.segment,
    goal: goal ? {
      goal_name: goal.goal_name,
      target_amount: goal.target_amount,
      target_year: goal.target_year,
      progress: goalProgress,
    } : null,
    recommended_portfolio: allocation,
    wealth_brief: aiInsights.wealth_brief,
    ai_strategy_summary: aiInsights.strategy_summary,
  });
});

module.exports = router;
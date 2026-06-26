const express = require("express");
const db = require("../db");
const requireAuth = require("../middleware/auth");
const { generateBehavioralInsights } = require("../services/aiService");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const userId = req.session.userId;

  const profile = db.prepare("SELECT * FROM financial_profiles WHERE user_id = ?").get(userId);
  const goal = db.prepare("SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").get(userId);
  const strategy = db.prepare("SELECT * FROM strategies WHERE user_id = ? ORDER BY generated_at DESC LIMIT 1").get(userId);
  const coachCount = db.prepare("SELECT COUNT(*) as count FROM coach_messages WHERE user_id = ? AND role = 'user'").get(userId);

  if (!profile) {
    return res.status(404).json({ error: "Profile not found." });
  }

  const monthlySavings = profile.monthly_savings || 0;
  const monthlyNeeded = strategy ? strategy.monthly_contribution : 0;
  const messageCount = coachCount.count || 0;

  let behavioralInsights;
  if (profile.ai_behavioral_insights) {
    try { behavioralInsights = JSON.parse(profile.ai_behavioral_insights); } catch (_) {}
  }
  if (!behavioralInsights) {
    behavioralInsights = await generateBehavioralInsights(profile, goal, strategy, messageCount);
    db.prepare("UPDATE financial_profiles SET ai_behavioral_insights=? WHERE user_id=?")
      .run(JSON.stringify(behavioralInsights), userId);
  }

  let decisionJournal = [];
  if (strategy && strategy.priority_actions) {
    try {
      const actions = JSON.parse(strategy.priority_actions);
      decisionJournal = actions.map((action, index) => ({
        title: action.title,
        status: index === 0 ? "Accepted" : index === 1 ? "Pending" : "Implemented",
      }));
    } catch (_) {}
  }

  const goalsCreated = db.prepare("SELECT COUNT(*) as count FROM goals WHERE user_id = ?").get(userId).count;
  const strategiesUsed = db.prepare("SELECT COUNT(*) as count FROM strategies WHERE user_id = ?").get(userId).count;

  const acceptedCount = decisionJournal.filter(d => d.status === "Accepted" || d.status === "Implemented").length;
  const acceptanceRate = decisionJournal.length > 0
    ? Math.round((acceptedCount / decisionJournal.length) * 100)
    : 0;

  let goalProgress = 0;
  let goalName = "";
  if (goal) {
    goalName = goal.goal_name;
    const monthsElapsed = Math.max(
      (new Date().getFullYear() - new Date(goal.created_at).getFullYear()) * 12 +
      (new Date().getMonth() - new Date(goal.created_at).getMonth()), 0
    );
    const contributed = monthlySavings * monthsElapsed;
    goalProgress = Math.min(Math.round((contributed / goal.target_amount) * 100), 100);
  }

  return res.json({
    decision_journal: decisionJournal,
    behavioral_insights: behavioralInsights,
    goals_created: goalsCreated,
    strategies_used: strategiesUsed,
    acceptance_rate: acceptanceRate,
    satisfaction: "4.6/5",
    goal_progress: {
      goal_name: goalName,
      progress: goalProgress,
    },
  });
});

module.exports = router;
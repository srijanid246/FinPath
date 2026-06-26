const express = require("express");
const db = require("../db");
const requireAuth = require("../middleware/auth");
const { calculateHealthScore } = require("../services/healthScore");
const { segmentUser } = require("../services/segmentation");
const { generateStrategy } = require("../services/strategyEngine");

const router = express.Router();

router.post("/submit", requireAuth, (req, res) => {
  const userId = req.session.userId;
  const {
    age, country, employment_status, annual_income, monthly_savings,
    goal_name, target_amount, target_year, priority,
    investment_experience, risk_tolerance, investment_horizon, expected_returns,
    current_investments, monthly_expenses, emergency_fund_status, debt_information,
  } = req.body;

  if (!goal_name || !target_amount || !target_year) {
    return res.status(400).json({ error: "Goal name, target amount and target year are required" });
  }

  const profileData = {
    age: parseInt(age) || null,
    country: country || null,
    employment_status: employment_status || null,
    annual_income: parseFloat(annual_income) || 0,
    monthly_savings: parseFloat(monthly_savings) || 0,
    goal_name,
    target_amount: parseFloat(target_amount),
    target_year: parseInt(target_year),
    priority: priority || "Medium",
    investment_experience: investment_experience || "Beginner",
    risk_tolerance: risk_tolerance || "Moderate",
    investment_horizon: parseInt(investment_horizon) || null,
    expected_returns: expected_returns || null,
    current_investments: current_investments || null,
    monthly_expenses: parseFloat(monthly_expenses) || 0,
    emergency_fund_status: emergency_fund_status || "No",
    debt_information: debt_information || "0",
  };

  const healthScore = calculateHealthScore(profileData);
  const segment = segmentUser(profileData);

  const existing = db.prepare("SELECT id FROM financial_profiles WHERE user_id = ?").get(userId);
  if (existing) {
    db.prepare(`UPDATE financial_profiles SET
      age=?, country=?, employment_status=?, annual_income=?, monthly_savings=?,
      goal_name=?, target_amount=?, target_year=?, priority=?,
      investment_experience=?, risk_tolerance=?, investment_horizon=?, expected_returns=?,
      current_investments=?, monthly_expenses=?, emergency_fund_status=?, debt_information=?,
      segment=?, health_score=?, updated_at=CURRENT_TIMESTAMP
      WHERE user_id=?`).run(
      profileData.age, profileData.country, profileData.employment_status,
      profileData.annual_income, profileData.monthly_savings,
      profileData.goal_name, profileData.target_amount, profileData.target_year, profileData.priority,
      profileData.investment_experience, profileData.risk_tolerance,
      profileData.investment_horizon, profileData.expected_returns,
      profileData.current_investments, profileData.monthly_expenses,
      profileData.emergency_fund_status, profileData.debt_information,
      segment, healthScore, userId
    );
  } else {
    db.prepare(`INSERT INTO financial_profiles (
      user_id, age, country, employment_status, annual_income, monthly_savings,
      goal_name, target_amount, target_year, priority,
      investment_experience, risk_tolerance, investment_horizon, expected_returns,
      current_investments, monthly_expenses, emergency_fund_status, debt_information,
      segment, health_score
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
      userId, profileData.age, profileData.country, profileData.employment_status,
      profileData.annual_income, profileData.monthly_savings,
      profileData.goal_name, profileData.target_amount, profileData.target_year, profileData.priority,
      profileData.investment_experience, profileData.risk_tolerance,
      profileData.investment_horizon, profileData.expected_returns,
      profileData.current_investments, profileData.monthly_expenses,
      profileData.emergency_fund_status, profileData.debt_information,
      segment, healthScore
    );
  }

  const existingGoal = db.prepare("SELECT id FROM goals WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").get(userId);
  let goalId;
  if (existingGoal) {
    db.prepare("UPDATE goals SET goal_name=?, target_amount=?, target_year=?, priority=? WHERE id=?")
      .run(goal_name, parseFloat(target_amount), parseInt(target_year), priority || "Medium", existingGoal.id);
    goalId = existingGoal.id;
  } else {
    const goalResult = db.prepare("INSERT INTO goals (user_id, goal_name, target_amount, target_year, priority) VALUES (?,?,?,?,?)")
      .run(userId, goal_name, parseFloat(target_amount), parseInt(target_year), priority || "Medium");
    goalId = goalResult.lastInsertRowid;
  }

  const strategy = generateStrategy(profileData, { target_year: parseInt(target_year), target_amount: parseFloat(target_amount) });

  const existingStrategy = db.prepare("SELECT id FROM strategies WHERE user_id = ?").get(userId);
  if (existingStrategy) {
    db.prepare(`UPDATE strategies SET
      goal_id=?, allocation=?, monthly_contribution=?, success_probability=?,
      next_best_action=?, priority_actions=?, generated_at=CURRENT_TIMESTAMP
      WHERE user_id=?`).run(
      goalId, JSON.stringify(strategy.allocation), strategy.monthly_contribution,
      strategy.success_probability, strategy.next_best_action,
      JSON.stringify(strategy.priority_actions), userId
    );
  } else {
    db.prepare(`INSERT INTO strategies (user_id, goal_id, allocation, monthly_contribution, success_probability, next_best_action, priority_actions)
      VALUES (?,?,?,?,?,?,?)`).run(
      userId, goalId, JSON.stringify(strategy.allocation), strategy.monthly_contribution,
      strategy.success_probability, strategy.next_best_action,
      JSON.stringify(strategy.priority_actions)
    );
  }

  return res.status(201).json({ message: "Profile saved", health_score: healthScore, segment });
});

module.exports = router;
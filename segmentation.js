function segmentUser(profile) {
  const monthlyIncome = (profile.annual_income || 0) / 12;
  const savingsRate = monthlyIncome > 0
    ? ((profile.monthly_savings || 0) / monthlyIncome) * 100
    : 0;
  const exp = (profile.investment_experience || "").toLowerCase();
  const risk = (profile.risk_tolerance || "").toLowerCase();

  if (exp === "beginner" && savingsRate < 15) return "Beginner Explorer";
  if (exp === "beginner" && savingsRate >= 15) return "Goal Planner";
  if (risk === "low" || risk === "conservative") return "Passive Builder";
  return "Growth Investor";
}

module.exports = { segmentUser };
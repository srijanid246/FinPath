function calculateHealthScore(profile) {
  let score = 0;
  const monthlyIncome = (profile.annual_income || 0) / 12;

  if (monthlyIncome > 0) {
    const savingsRate = ((profile.monthly_savings || 0) / monthlyIncome) * 100;
    if (savingsRate >= 20) score += 25;
    else if (savingsRate >= 10) score += 15;
    else if (savingsRate >= 5) score += 8;
    else score += 2;
  }

  const ef = (profile.emergency_fund_status || "").toLowerCase();
  if (ef === "yes") score += 20;
  else if (ef === "partial") score += 10;

  const debt = parseFloat(profile.debt_information) || 0;
  if (debt === 0) score += 20;
  else if (monthlyIncome > 0 && debt < monthlyIncome * 3) score += 12;
  else if (monthlyIncome > 0 && debt < monthlyIncome * 6) score += 6;
  else score += 2;

  if (profile.goal_name && profile.target_amount && profile.target_year) score += 20;
  else if (profile.goal_name) score += 8;

  const exp = (profile.investment_experience || "").toLowerCase();
  if (exp === "advanced") score += 15;
  else if (exp === "intermediate") score += 10;
  else score += 4;

  return Math.min(Math.round(score), 100);
}

module.exports = { calculateHealthScore };
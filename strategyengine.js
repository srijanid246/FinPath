function generateStrategy(profile, goal) {
  const risk = (profile.risk_tolerance || "moderate").toLowerCase();
  const currentYear = new Date().getFullYear();
  const monthsLeft = Math.max((goal.target_year - currentYear) * 12, 1);
  const monthlyNeeded = goal.target_amount / monthsLeft;
  const monthlySavings = profile.monthly_savings || 0;

  let allocation;
  if (risk === "high" || risk === "aggressive") {
    allocation = { "ETFs": 40, "Large Cap": 30, "Mid Cap": 20, "Cash": 10 };
  } else if (risk === "moderate" || risk === "medium") {
    allocation = { "ETFs": 30, "Large Cap": 30, "Bonds": 25, "Cash": 15 };
  } else {
    allocation = { "Bonds": 40, "ETFs": 20, "Large Cap": 20, "Cash": 20 };
  }

  const ratio = monthlySavings / Math.max(monthlyNeeded, 1);
  let successProbability;
  if (ratio >= 1.3) successProbability = 92;
  else if (ratio >= 1.1) successProbability = 82;
  else if (ratio >= 1.0) successProbability = 75;
  else if (ratio >= 0.8) successProbability = 60;
  else if (ratio >= 0.6) successProbability = 45;
  else successProbability = 30;

  const gap = monthlyNeeded - monthlySavings;
  const roundedGap = Math.ceil(Math.abs(gap) / 500) * 500;
  const nextBestAction = gap > 0
    ? `Increase monthly investment by ₹${roundedGap.toLocaleString("en-IN")} to stay on track`
    : "You're ahead of schedule! Consider diversifying into higher-growth assets";

  const priorityActions = [];
  if (gap > 0) {
    priorityActions.push({
      title: "Increase Monthly Investment",
      description: `Boost savings from ₹${monthlySavings.toLocaleString("en-IN")} to ₹${(monthlySavings + roundedGap).toLocaleString("en-IN")}`,
      impact: "High",
    });
  }
  if ((profile.emergency_fund_status || "").toLowerCase() !== "yes") {
    priorityActions.push({
      title: "Build Emergency Fund",
      description: "Maintain 3–6 months of expenses as a safety net before aggressive investing",
      impact: "High",
    });
  }
  if (parseFloat(profile.debt_information) > 0) {
    priorityActions.push({
      title: "Reduce High-Interest Debt",
      description: "Pay down existing debt to free up capital for investing",
      impact: "High",
    });
  }

  return {
    allocation,
    monthly_contribution: Math.round(monthlyNeeded),
    success_probability: successProbability,
    next_best_action: nextBestAction,
    priority_actions: priorityActions,
  };
}

module.exports = { generateStrategy };
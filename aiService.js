const Groq = require("groq-sdk");
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateDashboardInsights(profile, goal, strategy) {
  const monthlySavings = profile.monthly_savings || 0;
  const monthlyNeeded = strategy.monthly_contribution || 0;

  const prompt = `You are a financial advisor AI for FinPath, an Indian personal finance app.

User profile:
- Name: ${profile.first_name}
- Age: ${profile.age}
- Employment: ${profile.employment_status}
- Annual Income: ₹${(profile.annual_income || 0).toLocaleString("en-IN")}
- Monthly Savings: ₹${monthlySavings.toLocaleString("en-IN")}
- Monthly Expenses: ₹${(profile.monthly_expenses || 0).toLocaleString("en-IN")}
- Emergency Fund: ${profile.emergency_fund_status}
- Debt: ₹${profile.debt_information}
- Risk Tolerance: ${profile.risk_tolerance}
- Investment Experience: ${profile.investment_experience}
- Health Score: ${profile.health_score}/100
- Goal: ${goal.goal_name} — ₹${goal.target_amount.toLocaleString("en-IN")} by ${goal.target_year}
- Monthly contribution needed: ₹${monthlyNeeded.toLocaleString("en-IN")}
- Success probability: ${strategy.success_probability}%

Respond ONLY in this exact JSON format with no extra text, no markdown, no backticks:
{
  "strategy_summary": "One sentence max 20 words describing their personalized strategy direction",
  "wealth_brief": "Two sentences of specific actionable advice using their actual rupee amounts"
}`;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });
    const text = completion.choices[0].message.content.trim();
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Groq dashboard error:", err.message);
    return {
      strategy_summary: `A ${profile.risk_tolerance?.toLowerCase()} strategy to achieve your ${goal.goal_name} goal by ${goal.target_year}.`,
      wealth_brief: `Your monthly savings of ₹${monthlySavings.toLocaleString("en-IN")} is being tracked toward your goal of ₹${goal.target_amount.toLocaleString("en-IN")}. Stay consistent and review your portfolio quarterly.`,
    };
  }
}

async function generateStrategyInsights(profile, goal, strategy) {
  const monthlySavings = profile.monthly_savings || 0;
  const monthlyNeeded = strategy.monthly_contribution || 0;
  const debt = parseFloat(profile.debt_information) || 0;

  const prompt = `You are a financial advisor AI for FinPath, an Indian personal finance app.

User profile:
- Age: ${profile.age}
- Employment: ${profile.employment_status}
- Annual Income: ₹${(profile.annual_income || 0).toLocaleString("en-IN")}
- Monthly Savings: ₹${monthlySavings.toLocaleString("en-IN")}
- Monthly Expenses: ₹${(profile.monthly_expenses || 0).toLocaleString("en-IN")}
- Emergency Fund: ${profile.emergency_fund_status}
- Debt: ₹${debt.toLocaleString("en-IN")}
- Risk Tolerance: ${profile.risk_tolerance}
- Investment Experience: ${profile.investment_experience}
- Health Score: ${profile.health_score}/100
- Goal: ${goal.goal_name} — ₹${goal.target_amount.toLocaleString("en-IN")} by ${goal.target_year}
- Monthly contribution needed: ₹${monthlyNeeded.toLocaleString("en-IN")}
- Success probability: ${strategy.success_probability}%

Respond ONLY in this exact JSON format with no extra text, no markdown, no backticks:
{
  "priority_actions": [
    { "title": "action title", "description": "specific description using their actual rupee amounts", "impact": "High" },
    { "title": "action title", "description": "specific description using their actual rupee amounts", "impact": "High" },
    { "title": "action title", "description": "specific description using their actual rupee amounts", "impact": "Medium" }
  ],
  "why_strategy": {
    "risk_profile": "max 5 words describing their risk stance",
    "time_horizon": "${profile.investment_horizon || 10} Years until ${goal.target_year}",
    "savings_pattern": "max 5 words describing savings behavior",
    "goal_commitment": "max 5 words describing commitment level"
  }
}`;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
    });
    const text = completion.choices[0].message.content.trim();
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Groq strategy error:", err.message);
    const gap = monthlyNeeded - monthlySavings;
    const roundedGap = Math.ceil(Math.abs(gap) / 500) * 500;
    return {
      priority_actions: [
        {
          title: "Increase Monthly Investment",
          description: `Boost savings from ₹${monthlySavings.toLocaleString("en-IN")} to ₹${(monthlySavings + roundedGap).toLocaleString("en-IN")} to stay on track.`,
          impact: "High",
        },
        {
          title: "Build Emergency Fund",
          description: "Maintain 3–6 months of expenses as a safety net.",
          impact: "High",
        },
        {
          title: "Review Portfolio Quarterly",
          description: "Stay aligned with your goal by reviewing allocation every quarter.",
          impact: "Medium",
        },
      ],
      why_strategy: {
        risk_profile: `${profile.risk_tolerance} — balanced approach`,
        time_horizon: `${profile.investment_horizon || 10} Years until ${goal.target_year}`,
        savings_pattern: monthlySavings >= monthlyNeeded ? "Strong — ahead of target" : "Needs improvement",
        goal_commitment: goal.priority === "High" ? "Strong — high priority" : "Moderate",
      },
    };
  }
}

async function generatePortfolioAllocation(profile, goal) {
  const prompt = `You are a financial advisor AI for FinPath, an Indian personal finance app.

User profile:
- Age: ${profile.age}
- Employment: ${profile.employment_status}
- Annual Income: ₹${(profile.annual_income || 0).toLocaleString("en-IN")}
- Monthly Savings: ₹${(profile.monthly_savings || 0).toLocaleString("en-IN")}
- Risk Tolerance: ${profile.risk_tolerance}
- Investment Experience: ${profile.investment_experience}
- Investment Horizon: ${profile.investment_horizon || 10} years
- Emergency Fund: ${profile.emergency_fund_status}
- Debt: ₹${profile.debt_information}
- Goal: ${goal.goal_name} — ₹${goal.target_amount.toLocaleString("en-IN")} by ${goal.target_year}

Generate a personalized portfolio allocation that adds up to exactly 100.
Choose 3-5 asset classes from: ETFs, Large Cap, Mid Cap, Small Cap, Bonds, Gold, Cash, REITs, International Funds.

Respond ONLY in this exact JSON format with no extra text, no markdown, no backticks:
{
  "allocation": {
    "Asset Name": percentage_as_number,
    "Asset Name": percentage_as_number
  }
}`;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });
    const text = completion.choices[0].message.content.trim();
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    const total = Object.values(parsed.allocation).reduce((a, b) => a + b, 0);
    if (total !== 100) throw new Error("Allocation does not sum to 100");
    return parsed.allocation;
  } catch (err) {
    console.error("Groq portfolio error:", err.message);
    const risk = (profile.risk_tolerance || "moderate").toLowerCase();
    if (risk === "high" || risk === "aggressive") {
      return { "ETFs": 40, "Large Cap": 30, "Mid Cap": 20, "Cash": 10 };
    } else if (risk === "low" || risk === "conservative") {
      return { "Bonds": 40, "ETFs": 20, "Large Cap": 20, "Cash": 20 };
    } else {
      return { "ETFs": 30, "Large Cap": 30, "Bonds": 25, "Cash": 15 };
    }
  }
}

async function generateAnalyticsInsights(profile, goal, strategy) {
  const monthlySavings = profile.monthly_savings || 0;

  const prompt = `You are a financial behavior analyst for FinPath.

User Profile:
- Age: ${profile.age}
- Annual Income: ₹${(profile.annual_income || 0).toLocaleString("en-IN")}
- Monthly Savings: ₹${monthlySavings.toLocaleString("en-IN")}
- Risk Tolerance: ${profile.risk_tolerance}
- Investment Experience: ${profile.investment_experience}
- Health Score: ${profile.health_score}/100
- Goal: ${goal.goal_name} — ₹${goal.target_amount.toLocaleString("en-IN")} by ${goal.target_year}
- Success Probability: ${strategy.success_probability}%

Respond ONLY in valid JSON:

{
  "decision_journal": [
    {
      "title": "action title",
      "status": "Accepted"
    },
    {
      "title": "action title",
      "status": "Implemented"
    },
    {
      "title": "action title",
      "status": "Pending"
    }
  ],

  "behavioral_insights": {
    "consistency": "short phrase",
    "engagement": "short phrase",
    "risk_style": "short phrase"
  },

  "financial_personality": {
    "title": "personality name",
    "description": "1 sentence description"
  }
}`;
  
  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const text = completion.choices[0].message.content.trim();
    const cleaned = text.replace(/```json|```/g, "").trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Groq analytics error:", err.message);

    return {
      decision_journal: [
        {
          title: "Increase Monthly Savings",
          status: "Accepted",
        },
        {
          title: "Build Emergency Fund",
          status: "Implemented",
        },
        {
          title: "Review Portfolio Quarterly",
          status: "Pending",
        },
      ],

      behavioral_insights: {
        consistency: "Strong Savings Discipline",
        engagement: "Goal-Oriented Planner",
        risk_style: `${profile.risk_tolerance} Risk Preference`,
      },

      financial_personality: {
        title: profile.segment || "Growth Investor",
        description:
          "Focused on long-term wealth creation with disciplined investing habits.",
      },
    };
  }
}

async function generateBehavioralInsights(profile, goal, strategy, messageCount) {
  const monthlySavings = profile.monthly_savings || 0;
  const monthlyNeeded = strategy ? strategy.monthly_contribution : 0;
  const debt = parseFloat(profile.debt_information) || 0;

  const prompt = `You are a financial behavior analyst for FinPath, an Indian personal finance app.

User profile:
- Age: ${profile.age}
- Employment: ${profile.employment_status}
- Monthly Savings: ₹${monthlySavings.toLocaleString("en-IN")}
- Monthly Needed for Goal: ₹${monthlyNeeded.toLocaleString("en-IN")}
- Risk Tolerance: ${profile.risk_tolerance}
- Investment Experience: ${profile.investment_experience}
- Emergency Fund: ${profile.emergency_fund_status}
- Debt: ₹${debt.toLocaleString("en-IN")}
- Health Score: ${profile.health_score}/100
- Segment: ${profile.segment}
- Goal: ${goal?.goal_name} by ${goal?.target_year}
- AI Coach messages sent: ${messageCount}

Based on this user's actual financial behavior and data, generate three personalized behavioral observations.
Each should be 1 short sentence, specific to their numbers, not generic labels.

Respond ONLY in this exact JSON format with no extra text, no markdown, no backticks:
{
  "consistency": "one sentence about their savings consistency based on their actual numbers",
  "engagement": "one sentence about their financial engagement based on coach usage and profile",
  "risk_style": "one sentence about their risk approach based on their actual risk tolerance and experience"
}`;

  try {
    const completion = await client.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });
    const text = completion.choices[0].message.content.trim();
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Groq behavioral error:", err.message);
    const monthlySavings_ = profile.monthly_savings || 0;
    const ratio = monthlyNeeded > 0 ? monthlySavings_ / monthlyNeeded : 1;
    return {
      consistency: ratio >= 1 ? "You're consistently saving above your target contribution." : "Your savings are below your target — small increases will make a big difference.",
      engagement: messageCount >= 5 ? "You actively engage with financial guidance and seek advice regularly." : "You're beginning to explore your financial options.",
      risk_style: `You prefer a ${profile.risk_tolerance?.toLowerCase()} approach, balancing growth with security.`,
    };
  }
}

module.exports = { generateDashboardInsights, generateStrategyInsights, generatePortfolioAllocation, generateBehavioralInsights };
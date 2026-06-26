const express = require("express");
const Groq = require("groq-sdk");
const db = require("../db");
const requireAuth = require("../middleware/auth");

const router = express.Router();
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.get("/history", requireAuth, (req, res) => {
  const messages = db
    .prepare("SELECT role, content, created_at FROM coach_messages WHERE user_id = ? ORDER BY created_at ASC")
    .all(req.session.userId);
  return res.json({ messages });
});

router.post("/message", requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  const user = db.prepare("SELECT first_name, last_name FROM users WHERE id = ?").get(userId);
  const profile = db.prepare("SELECT * FROM financial_profiles WHERE user_id = ?").get(userId);
  const goal = db.prepare("SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").get(userId);
  const history = db
    .prepare("SELECT role, content FROM coach_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 10")
    .all(userId)
    .reverse();

  const systemPrompt = `You are FinPath's AI Financial Coach.

User: ${user.first_name} ${user.last_name}
Age: ${profile?.age}, Employment: ${profile?.employment_status}
Annual Income: ₹${(profile?.annual_income || 0).toLocaleString("en-IN")}
Monthly Savings: ₹${(profile?.monthly_savings || 0).toLocaleString("en-IN")}
Monthly Expenses: ₹${(profile?.monthly_expenses || 0).toLocaleString("en-IN")}
Risk Tolerance: ${profile?.risk_tolerance}
Investment Experience: ${profile?.investment_experience}
Health Score: ${profile?.health_score}/100
Emergency Fund: ${profile?.emergency_fund_status}
Debt: ₹${profile?.debt_information}
Goal: ${goal?.goal_name} — ₹${(goal?.target_amount || 0).toLocaleString("en-IN")} by ${goal?.target_year}

Rules:
- Be warm, concise and specific to this user's actual numbers
- Use ₹ for all amounts
- Never give specific stock picks
- Frame everything as educational guidance not financial advice
- Keep responses to 2-4 sentences unless the user asks for more detail`;

  const conversationHistory = history.map(m => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content,
  }));

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: message.trim() },
      ],
      max_tokens: 500,
    });

    const assistantMessage = completion.choices[0].message.content.trim();

    db.prepare("INSERT INTO coach_messages (user_id, role, content) VALUES (?,?,?)").run(userId, "user", message.trim());
    db.prepare("INSERT INTO coach_messages (user_id, role, content) VALUES (?,?,?)").run(userId, "assistant", assistantMessage);

    return res.json({ message: assistantMessage });
  } catch (err) {
    console.error("Groq coach error:", err.message);
    return res.status(500).json({ error: "AI Coach is temporarily unavailable. Please try again." });
  }
});

router.delete("/history", requireAuth, (req, res) => {
  db.prepare("DELETE FROM coach_messages WHERE user_id = ?").run(req.session.userId);
  return res.json({ message: "Chat history cleared" });
});

module.exports = router;
const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "finpath.db"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    country TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS financial_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    age INTEGER,
    country TEXT,
    employment_status TEXT,
    annual_income REAL DEFAULT 0,
    monthly_savings REAL DEFAULT 0,
    goal_name TEXT,
    target_amount REAL DEFAULT 0,
    target_year INTEGER,
    priority TEXT,
    investment_experience TEXT,
    risk_tolerance TEXT,
    investment_horizon INTEGER,
    expected_returns TEXT,
    current_investments TEXT,
    monthly_expenses REAL DEFAULT 0,
    emergency_fund_status TEXT,
    debt_information TEXT,
    segment TEXT,
    health_score INTEGER DEFAULT 0,
    ai_wealth_brief TEXT,
    ai_strategy_summary TEXT,
    ai_portfolio TEXT,
    ai_strategy_insights TEXT,
    ai_analytics_insights TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    goal_name TEXT NOT NULL,
    target_amount REAL NOT NULL,
    target_year INTEGER NOT NULL,
    priority TEXT DEFAULT 'Medium',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS strategies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    goal_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
    allocation TEXT NOT NULL,
    monthly_contribution REAL,
    success_probability REAL,
    next_best_action TEXT,
    priority_actions TEXT,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS coach_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log("Database ready");
module.exports = db;
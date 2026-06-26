import { useEffect, useState } from "react";
import Sidebar from "../page 4/sidebar";
import { api } from "../api";
import "./strategy.css";
import { useRequireProfile } from "../useRequireProfile";

function Strategy() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useRequireProfile(error);
  useEffect(() => {
    api.getStrategy()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="strategy-page">
      <Sidebar activePage="strategy" />
      <div className="strategy-content"><p style={{ padding: "2rem" }}>Loading strategy...</p></div>
    </div>
  );

  if (error) return (
    <div className="strategy-page">
      <Sidebar activePage="strategy" />
      <div className="strategy-content"><p style={{ padding: "2rem", color: "red" }}>{error}</p></div>
    </div>
  );

  const { strategy, current_monthly_savings, suggested_monthly_savings, outcomes, reasons } = data;

  return (
    <div className="strategy-page">
      <Sidebar activePage="strategy" />

      <div className="strategy-content">

        <div className="strategy-header">
          <h1>Financial Strategy</h1>
          <p>Personalized action plan designed to help you achieve your financial goals.</p>
        </div>

        {/* Next Best Action */}
        <div className="action-card">
          <h2>Your Next Best Action</h2>
          <div className="action-highlight">
            <h3>Increase Monthly Investment</h3>
            <p>
              ₹{current_monthly_savings.toLocaleString("en-IN")} → ₹{suggested_monthly_savings.toLocaleString("en-IN")}
            </p>
            <span>
              +{Math.round(outcomes.improved_success - outcomes.current_success)}% Goal Success Probability
            </span>
          </div>
        </div>

        {/* Priority Actions */}
        <div className="strategy-card">
          <h2>Priority Actions</h2>
          {strategy.priority_actions.map((action, index) => (
            <div className="action-item" key={index}>
              <div>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <span>{action.impact}</span>
            </div>
          ))}
        </div>

        {/* Why This Strategy */}
        <div className="strategy-card">
          <h2>Why This Strategy?</h2>
          <div className="reason-grid">
            <div className="reason-card">
              <h3>Risk Profile</h3>
              <p>{reasons.risk_profile}</p>
            </div>
            <div className="reason-card">
              <h3>Time Horizon</h3>
              <p>{reasons.time_horizon}</p>
            </div>
            <div className="reason-card">
              <h3>Savings Pattern</h3>
              <p>{reasons.savings_pattern}</p>
            </div>
            <div className="reason-card">
              <h3>Goal Commitment</h3>
              <p>{reasons.goal_commitment}</p>
            </div>
          </div>
        </div>

        {/* Outcomes */}
        <div className="outcomes-row">
          <div className="outcome-card">
            <p>Success Rate</p>
            <h2>{outcomes.current_success}% → {outcomes.improved_success}%</h2>
          </div>
          <div className="outcome-card">
            <p>Projected Wealth</p>
            <h2>
              ₹{(outcomes.current_wealth / 100000).toFixed(1)}L → ₹{(outcomes.improved_wealth / 100000).toFixed(1)}L
            </h2>
          </div>
          <div className="outcome-card">
            <p>Goal Year</p>
            <h2>{outcomes.current_goal_year} → {outcomes.improved_goal_year}</h2>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Strategy;
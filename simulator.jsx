import { useState, useEffect } from "react";
import Sidebar from "../page 4/sidebar";
import { api } from "../api";
import "./simulator.css";
import { useRequireProfile } from "../useRequireProfile";

function Simulator() {
  const [investment, setInvestment] = useState(10000);
  const [timeline, setTimeline] = useState(10);
  const [risk, setRisk] = useState("Moderate");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useRequireProfile(error);
  useEffect(() => {
  runSimulation();
}, []);

useEffect(() => {
  const timeout = setTimeout(() => {
    runSimulation();
  }, 400);
  return () => clearTimeout(timeout);
}, [investment, timeline, risk]);

  async function runSimulation() {
    setLoading(true);
    try {
      const data = await api.simulate({
        monthly_investment: investment,
        timeline_years: timeline,
        risk_level: risk,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="simulator-page">
      <Sidebar activePage="simulator" />

      <div className="simulator-content">

        <div className="simulator-header">
          <h1>What-If Simulator</h1>
          <p>Explore how different financial decisions impact your goals.</p>
        </div>

        <div className="simulator-card">
          <h2>Monthly Investment</h2>
          <h3>₹{investment.toLocaleString("en-IN")}</h3>
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
          />
        </div>

        <div className="simulator-card">
          <h2>Investment Timeline</h2>
          <h3>{timeline} Years</h3>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={timeline}
            onChange={(e) => setTimeline(Number(e.target.value))}
          />
        </div>

        <div className="simulator-card">
          <h2>Risk Level</h2>
          <div className="risk-buttons">
            {["Low", "Moderate", "High"].map((level) => (
              <button
                key={level}
                className={`risk-btn ${risk === level ? "active" : ""}`}
                onClick={() => setRisk(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="results-row">
          <div className="result-card">
            <p>Success Probability</p>
            <h2>{loading ? "..." : `${result?.success_probability ?? "--"}%`}</h2>
          </div>
          <div className="result-card">
            <p>Projected Wealth</p>
            <h2>
              {loading ? "..." : result
                ? `₹${result.projected_wealth.toLocaleString("en-IN")}`
                : "--"}
            </h2>
          </div>
          <div className="result-card">
            <p>Goal Achievement</p>
            <h2>{loading ? "..." : result?.goal_achievement_year ?? "--"}</h2>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Simulator;
import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import MetricCard from "./metric";
import { api } from "../api";
import "./dashboard.css";
import { useRequireProfile } from "../useRequireProfile";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useRequireProfile(error);
  useEffect(() => {
    api.getDashboard()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="dashboard-page">
      <Sidebar activePage="dashboard" />
      <div className="dashboard-content"><p style={{ padding: "2rem" }}>Loading...</p></div>
    </div>
  );

  if (error) return (
    <div className="dashboard-page">
      <Sidebar activePage="dashboard" />
      <div className="dashboard-content"><p style={{ padding: "2rem", color: "red" }}>{error}</p></div>
    </div>
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const allocation = data.recommended_portfolio || {};

  return (
    <div className="dashboard-page">
      <Sidebar activePage="dashboard" />
      <div className="dashboard-content">

        <div className="welcome-card">
          <h1>{greeting}, {data.user.first_name}</h1>
          <p>{data.ai_strategy_summary}</p>
        </div>

        <div className="metrics">
          <MetricCard title="Health Score" value={data.health_score} />
          <MetricCard title="Goal Success" value={`${data.goal_success_probability}%`} />
          <MetricCard title="Risk Profile" value={data.risk_profile} />
        </div>

        <div className="summary-card">
          <h2>AI Strategy Summary</h2>
          <p>{data.ai_strategy_summary}</p>
        </div>

        <div className="portfolio-card">
          <h2>Recommended Portfolio</h2>
          {Object.entries(allocation).map(([name, percent]) => (
            <div className="allocation-row" key={name}>
              <div className="allocation-header">
                <span>{name}</span>
                <span>{percent}%</span>
              </div>
              <div className="allocation-bar">
                <div className="allocation-fill" style={{ width: `${percent}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="brief-card">
          <h2>Today's Wealth Brief</h2>
          <p>{data.wealth_brief}</p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
import { useEffect, useState } from "react";
import Sidebar from "../page 4/sidebar";
import { api } from "../api";
import "./analytics.css";
import { useRequireProfile } from "../useRequireProfile";

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

useRequireProfile();
  useEffect(() => {
    api.getAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="analytics-page">
      <Sidebar activePage="analytics" />
      <div className="analytics-content"><p style={{ padding: "2rem" }}>Loading...</p></div>
    </div>
  );

  return (
    <div className="analytics-page">
      <Sidebar activePage="analytics" />

      <div className="analytics-content">

        <div className="analytics-header">
          <h1>Analytics</h1>
          <p>Track your decisions and financial progress.</p>
        </div>

        <div className="journal-card">
          <h2>Decision Journal</h2>
          {data?.decision_journal?.length === 0 && (
            <p style={{ color: "#6b7280", padding: "0.5rem 0" }}>No decisions yet.</p>
          )}
          {data?.decision_journal?.map((item, index) => (
            <div className="journal-entry" key={index}>
              <h3>{item.title}</h3>
              <span style={{
                color: item.status === "Accepted" ? "#2563eb"
                  : item.status === "Implemented" ? "#16a34a"
                  : "#f59e0b"
              }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>

        <div className="insights-card">
          <h2>Behavioral Insights</h2>
          <div className="insights-grid">
            <div className="insight-box">
              <h3>Consistency</h3>
              <p>{data?.behavioral_insights?.consistency}</p>
            </div>
            <div className="insight-box">
              <h3>Engagement</h3>
              <p>{data?.behavioral_insights?.engagement}</p>
            </div>
            <div className="insight-box">
              <h3>Risk Style</h3>
              <p>{data?.behavioral_insights?.risk_style}</p>
            </div>
          </div>
        </div>

        <div className="metrics-row">
          <div className="metric-card">
            <p>Goals Created</p>
            <h2>{data?.goals_created ?? 0}</h2>
          </div>
          <div className="metric-card">
            <p>Strategies Used</p>
            <h2>{data?.strategies_used ?? 0}</h2>
          </div>
          <div className="metric-card">
            <p>Acceptance Rate</p>
            <h2>{data?.acceptance_rate ?? 0}%</h2>
          </div>
          <div className="metric-card">
            <p>Satisfaction</p>
            <h2>{data?.satisfaction ?? "N/A"}</h2>
          </div>
        </div>

        <div className="progress-card">
          <h2>Goal Progress</h2>
          <p>{data?.goal_progress?.goal_name}</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${data?.goal_progress?.progress ?? 0}%` }}
            />
          </div>
          <span>{data?.goal_progress?.progress ?? 0}%</span>
        </div>

      </div>
    </div>
  );
}

export default Analytics;
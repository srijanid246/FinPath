import { useEffect, useState } from "react";
import Sidebar from "../page 4/sidebar";
import { api } from "../api";
import "./profile.css";
import { useRequireProfile } from "../useRequireProfile";

function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useRequireProfile();
  useEffect(() => {
    api.getProfile()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="profile-page">
      <Sidebar activePage="profile" />
      <div className="profile-content"><p style={{ padding: "2rem" }}>Loading...</p></div>
    </div>
  );

  const { personal, financial, health_score } = data;

  return (
    <div className="profile-page">
      <Sidebar activePage="profile" />

      <div className="profile-content">

        <div className="profile-header">
          <h1>Profile</h1>
          <p>Manage your financial profile and preferences.</p>
        </div>

        <div className="profile-card">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <h3>Name</h3>
              <p>{personal?.name || "—"}</p>
            </div>
            <div className="info-item">
              <h3>Email</h3>
              <p>{personal?.email || "—"}</p>
            </div>
            <div className="info-item">
              <h3>Age</h3>
              <p>{personal?.age || "—"}</p>
            </div>
            <div className="info-item">
              <h3>Occupation</h3>
              <p>{personal?.occupation || "—"}</p>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h2>Financial Preferences</h2>
          <div className="info-grid">
            <div className="info-item">
              <h3>Risk Profile</h3>
              <p>{financial?.risk_profile || "—"}</p>
            </div>
            <div className="info-item">
              <h3>Investment Horizon</h3>
              <p>{financial?.investment_horizon ? `${financial.investment_horizon} Years` : "—"}</p>
            </div>
            <div className="info-item">
              <h3>Primary Goal</h3>
              <p>{financial?.primary_goal || "—"}</p>
            </div>
            <div className="info-item">
              <h3>Monthly Investment</h3>
              <p>{financial?.monthly_savings ? `₹${Number(financial.monthly_savings).toLocaleString("en-IN")}` : "—"}</p>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h2>Financial Snapshot</h2>
          <div className="info-grid">
            <div className="info-item">
              <h3>Annual Income</h3>
              <p>{financial?.annual_income ? `₹${Number(financial.annual_income).toLocaleString("en-IN")}` : "—"}</p>
            </div>
            <div className="info-item">
              <h3>Monthly Expenses</h3>
              <p>{financial?.monthly_expenses ? `₹${Number(financial.monthly_expenses).toLocaleString("en-IN")}` : "—"}</p>
            </div>
            <div className="info-item">
              <h3>Emergency Fund</h3>
              <p>{financial?.emergency_fund || "—"}</p>
            </div>
            <div className="info-item">
              <h3>Health Score</h3>
              <p>{health_score}/100</p>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h2>Account Settings</h2>
          <div className="setting-row">
            <span>Notifications</span>
            <span className="enabled">Enabled</span>
          </div>
          <div className="setting-row">
            <span>AI Coaching</span>
            <span className="enabled">Enabled</span>
          </div>
          <div className="setting-row">
            <span>Data Sharing</span>
            <span className="disabled">Disabled</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;
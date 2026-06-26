import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./progressbar";
import Step1 from "./step1.jsx";
import Step2 from "./step2.jsx";
import Step3 from "./step3.jsx";
import Step4 from "./step4.jsx";
import { api } from "../api";
import "./financial.css";

const requiredFields = {
  1: ["age", "country", "employment_status", "annual_income", "monthly_savings"],
  2: ["goal_name", "target_amount", "target_year", "priority"],
  3: ["investment_experience", "risk_tolerance", "investment_horizon", "expected_returns"],
  4: ["current_investments", "monthly_expenses", "emergency_fund_status", "debt_information"],
};

const fieldLabels = {
  age: "Age",
  country: "Country",
  employment_status: "Employment Status",
  annual_income: "Annual Income",
  monthly_savings: "Monthly Savings",
  goal_name: "Goal",
  target_amount: "Target Amount",
  target_year: "Target Year",
  priority: "Priority",
  investment_experience: "Investment Experience",
  risk_tolerance: "Risk Tolerance",
  investment_horizon: "Investment Horizon",
  expected_returns: "Expected Returns",
  current_investments: "Current Investments",
  monthly_expenses: "Monthly Expenses",
  emergency_fund_status: "Emergency Fund Status",
  debt_information: "Debt Information",
};

function FinancialDiscovery() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    age: "", country: "", employment_status: "", annual_income: "", monthly_savings: "",
    goal_name: "", target_amount: "", target_year: "", priority: "",
    investment_experience: "", risk_tolerance: "", investment_horizon: "", expected_returns: "",
    current_investments: "", monthly_expenses: "", emergency_fund_status: "", debt_information: "",
  });

  const updateForm = (fields) => setFormData((prev) => ({ ...prev, ...fields }));

  const validate = () => {
    const fields = requiredFields[step];
    const empty = fields.filter(f => !formData[f] || formData[f].toString().trim() === "");
    if (empty.length > 0) {
      setError(`Please fill in: ${empty.map(f => fieldLabels[f]).join(", ")}`);
      return false;
    }
    if (step === 1) {
      if (isNaN(formData.age) || formData.age <= 0) {
        setError("Please enter a valid age.");
        return false;
      }
      if (isNaN(formData.annual_income) || formData.annual_income <= 0) {
        setError("Please enter a valid annual income.");
        return false;
      }
      if (isNaN(formData.monthly_savings) || formData.monthly_savings < 0) {
        setError("Please enter a valid monthly savings amount.");
        return false;
      }
    }
    if (step === 2) {
      if (isNaN(formData.target_amount) || formData.target_amount <= 0) {
        setError("Please enter a valid target amount.");
        return false;
      }
      const currentYear = new Date().getFullYear();
      if (isNaN(formData.target_year) || formData.target_year <= currentYear) {
        setError(`Target year must be after ${currentYear}.`);
        return false;
      }
    }
    if (step === 3) {
      if (isNaN(formData.investment_horizon) || formData.investment_horizon <= 0) {
        setError("Please enter a valid investment horizon.");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (validate()) setStep(step + 1);
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.submitDiscovery(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 data={formData} onChange={updateForm} />;
      case 2: return <Step2 data={formData} onChange={updateForm} />;
      case 3: return <Step3 data={formData} onChange={updateForm} />;
      case 4: return <Step4 data={formData} onChange={updateForm} />;
      default: return <Step1 data={formData} onChange={updateForm} />;
    }
  };

  return (
    <div className="discovery-page">
      <ProgressBar currentStep={step} />

      <div className="step-container">
        {renderStep()}
      </div>

      {error && (
        <p style={{
          color: "red",
          fontSize: "0.875rem",
          marginTop: "0.75rem",
          width: "700px",
          textAlign: "left",
        }}>
          ⚠️ {error}
        </p>
      )}

      <div className="navigation-buttons">
        {step > 1 && (
          <button onClick={handleBack}>Back</button>
        )}
        {step < 4
          ? <button onClick={handleNext}>Next</button>
          : <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
        }
      </div>
    </div>
  );
}

export default FinancialDiscovery;
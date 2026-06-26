function Step3({ data, onChange }) {
  const handle = (e) => onChange({ [e.target.name]: e.target.value });
  return (
    <div>
      <h2>Risk Profile</h2>
      <select name="investment_experience" value={data.investment_experience} onChange={handle}>
        <option value="">Investment Experience</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
      <select name="risk_tolerance" value={data.risk_tolerance} onChange={handle}>
        <option value="">Risk Tolerance</option>
        <option value="Low">Low (Conservative)</option>
        <option value="Moderate">Moderate</option>
        <option value="High">High (Aggressive)</option>
      </select>
      <input name="investment_horizon" type="number" placeholder="Investment Horizon (years)" value={data.investment_horizon} onChange={handle} />
      <select name="expected_returns" value={data.expected_returns} onChange={handle}>
        <option value="">Expected Returns</option>
        <option value="7-9%">7–9% (Conservative)</option>
        <option value="10-12%">10–12% (Moderate)</option>
        <option value="13-15%">13–15% (Aggressive)</option>
      </select>
    </div>
  );
}
export default Step3;
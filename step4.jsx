function Step4({ data, onChange }) {
  const handle = (e) => onChange({ [e.target.name]: e.target.value });
  return (
    <div>
      <h2>Financial Habits</h2>
      <select name="current_investments" value={data.current_investments} onChange={handle}>
        <option value="">Current Investments</option>
        <option value="None">None</option>
        <option value="FD/RD">FD / RD</option>
        <option value="Mutual Funds">Mutual Funds</option>
        <option value="Stocks">Stocks</option>
        <option value="Mixed">Mixed Portfolio</option>
      </select>
      <input name="monthly_expenses" type="number" placeholder="Monthly Expenses (₹)" value={data.monthly_expenses} onChange={handle} />
      <select name="emergency_fund_status" value={data.emergency_fund_status} onChange={handle}>
        <option value="">Emergency Fund Status</option>
        <option value="Yes">Yes — Fully Funded</option>
        <option value="Partial">Partial</option>
        <option value="No">No</option>
      </select>
      <input name="debt_information" type="number" placeholder="Total Debt (₹) — enter 0 if none" value={data.debt_information} onChange={handle} />
    </div>
  );
}
export default Step4;
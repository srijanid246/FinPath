function Step1({ data, onChange }) {
  const handle = (e) => onChange({ [e.target.name]: e.target.value });
  return (
    <div>
      <h2>Personal Information</h2>
      <input name="age" type="number" placeholder="Age" value={data.age} onChange={handle} />
      <input name="country" placeholder="Country" value={data.country} onChange={handle} />
      <select name="employment_status" value={data.employment_status} onChange={handle}>
        <option value="">Employment Status</option>
        <option value="Student">Student</option>
        <option value="Salaried">Salaried</option>
        <option value="Self-Employed">Self-Employed</option>
        <option value="Freelancer">Freelancer</option>
        <option value="Unemployed">Unemployed</option>
        <option value="Retired">Retired</option>
      </select>
      <input name="annual_income" type="number" placeholder="Annual Income (₹)" value={data.annual_income} onChange={handle} />
      <input name="monthly_savings" type="number" placeholder="Monthly Savings (₹)" value={data.monthly_savings} onChange={handle} />
    </div>
  );
}
export default Step1;
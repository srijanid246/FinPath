function Step2({ data, onChange }) {
  const handle = (e) => onChange({ [e.target.name]: e.target.value });
  return (
    <div>
      <h2>Financial Goals</h2>
      <select name="goal_name" value={data.goal_name} onChange={handle}>
        <option value="">Select Goal</option>
        <option value="Buy a House">Buy a House</option>
        <option value="Retirement">Retirement</option>
        <option value="Education">Education</option>
        <option value="Emergency Fund">Emergency Fund</option>
        <option value="Travel">Travel</option>
        <option value="Wealth Creation">Wealth Creation</option>
      </select>
      <input name="target_amount" type="number" placeholder="Target Amount (₹)" value={data.target_amount} onChange={handle} />
      <input name="target_year" type="number" placeholder="Target Year (e.g. 2035)" value={data.target_year} onChange={handle} />
      <select name="priority" value={data.priority} onChange={handle}>
        <option value="">Priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>
  );
}
export default Step2;
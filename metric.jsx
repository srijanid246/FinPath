function MetricCard({ title, value }) {
  return (
    <div className="metric-card">

      <p>{title}</p>

      <h2>{value}</h2>

    </div>
  );
}

export default MetricCard;
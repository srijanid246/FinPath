function AllocationCard({ asset, percentage }) {
  return (
    <div className="allocation-card">

      <h3>{asset}</h3>

      <h2>{percentage}</h2>

    </div>
  );
}

export default AllocationCard;
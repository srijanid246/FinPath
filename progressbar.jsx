function ProgressBar({ currentStep }) {
  return (
    <div className="progress-container">

      <div className={currentStep >= 1 ? "step active" : "step"}>
        Step 1
      </div>

      <div className={currentStep >= 2 ? "step active" : "step"}>
        Step 2
      </div>

      <div className={currentStep >= 3 ? "step active" : "step"}>
        Step 3
      </div>

      <div className={currentStep >= 4 ? "step active" : "step"}>
        Step 4
      </div>

    </div>
  );
}

export default ProgressBar;
import './AnalysisBox.css';

export default function AnalysisBox({ label, value }) {
  return (
    <div className="analysis-box">
      <div className="analysis-label">
        {label}
      </div>

      <div className="analysis-value">
        {value}
      </div>
    </div>
  );
}
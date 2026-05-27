import './AnalysisBox.css';

type AnalysisBoxProps = {
  label: string;
  value: string | number;
};

export default function AnalysisBox({ label, value }: AnalysisBoxProps) {
  return (
    <div className="analysis-box">
      <div className="analysis-label">{label}</div>
      <div className="analysis-value">{value}</div>
    </div>
  );
}
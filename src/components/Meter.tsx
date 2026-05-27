import './Meter.css';

type MeterProps = {
  label: string;
  value: number;
};

export default function Meter({ label, value }: MeterProps) {
  return (
    <div className="meter-wrap">
      <div className="meter-header">
        <div className="meter-label">{label}</div>
        <div className="meter-value">{value}%</div>
      </div>

      <div className="meter-track">
        <div
          className="meter-fill"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
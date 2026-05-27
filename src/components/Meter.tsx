import './Meter.css';

export default function Meter({ label, value }) {
  return (
    <div className="meter-wrap">
      <div className="meter-header">
        <div className="meter-label">
          {label}
        </div>

        <div className="meter-value">
          {value}%
        </div>
      </div>

      <div className="meter-track">
        <div
          className="meter-fill"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}
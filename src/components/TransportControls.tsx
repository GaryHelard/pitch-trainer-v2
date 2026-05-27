import './TransportControls.css';

export default function TransportControls({
  isPlaying,
  onPlayPause,
  onStop,
  onSkipBack,
  onSkipForward,
}) {
  return (
    <div className="transport">
      <button
        className="transport-button"
        onClick={onSkipBack}
      >
        -5s
      </button>

      <button
        className="transport-button"
        onClick={onPlayPause}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <button
        className="transport-button"
        onClick={onStop}
      >
        Stop
      </button>

      <button
        className="transport-button"
        onClick={onSkipForward}
      >
        +5s
      </button>
    </div>
  );
}
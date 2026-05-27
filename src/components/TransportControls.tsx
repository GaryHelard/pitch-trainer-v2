import './TransportControls.css';

type TransportControlsProps = {
  isPlaying: boolean;
  disabled?: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
};

export default function TransportControls({
  isPlaying,
  disabled = false,
  onPlayPause,
  onStop,
  onSkipBack,
  onSkipForward,
}: TransportControlsProps) {
  return (
    <div className="transport">
      <button
        className="transport-button"
        onClick={onSkipBack}
        disabled={disabled}
      >
        -5s
      </button>

      <button
        className="transport-button"
        onClick={onPlayPause}
        disabled={disabled}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <button
        className="transport-button"
        onClick={onStop}
        disabled={disabled}
      >
        Stop
      </button>

      <button
        className="transport-button"
        onClick={onSkipForward}
        disabled={disabled}
      >
        +5s
      </button>
    </div>
  );
}
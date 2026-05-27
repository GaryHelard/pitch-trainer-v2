import './TransportControls.css';

type TransportControlsProps = {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
};

export default function TransportControls({
  isPlaying,
  onPlayPause,
  onStop,
  onSkipBack,
  onSkipForward,
}: TransportControlsProps) {
  return (
    <div className="transport">
      <button className="transport-button" onClick={onSkipBack}>
        -5s
      </button>

      <button className="transport-button" onClick={onPlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <button className="transport-button" onClick={onStop}>
        Stop
      </button>

      <button className="transport-button" onClick={onSkipForward}>
        +5s
      </button>
    </div>
  );
}
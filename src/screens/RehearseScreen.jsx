import { useState } from 'react';

import AnalysisBox from '../components/AnalysisBox';
import Meter from '../components/Meter';
import TransportControls from '../components/TransportControls';

import useMicrophonePitch from '../hooks/useMicrophonePitch';

import './RehearseScreen.css';

const PARTS = [
  'Bass',
  'Baritone',
  'Lead',
  'Tenor',
];

export default function RehearseScreen() {
  const [part, setPart] = useState('Lead');

  const [pitchScore] = useState(84);
  const [timingScore] = useState(78);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const {
    isListening,
    frequency,
    note,
    centsOff,
    volume,
    startListening,
    stopListening,
  } = useMicrophonePitch();

  return (
    <div className="rehearse-screen">
      <h1 className="screen-title">
        Rehearse
      </h1>

      <p className="screen-subtitle">
        Upload audio and sheet music,
        then compare your singing.
      </p>

      <button className="upload-button">
        Upload Reference Audio
      </button>

      <button className="sheet-button">
        Upload Sheet Music PDF
      </button>

      <div className="analysis-grid">
        <AnalysisBox
          label="KEY"
          value="E♭ major"
        />

        <AnalysisBox
          label="TIME"
          value="4/4"
        />

        <AnalysisBox
          label="TEMPO"
          value="♩ = 130"
        />

        <AnalysisBox
          label="FEEL"
          value="Swing"
        />
      </div>

      <TransportControls
        isPlaying={isPlaying}
        onPlayPause={() =>
          setIsPlaying(!isPlaying)
        }
        onStop={() => setIsPlaying(false)}
        onSkipBack={() => {}}
        onSkipForward={() => {}}
      />

      <div className="card">
        <div className="label">
          YOUR PART
        </div>

        <div className="part-grid">
          {PARTS.map((item) => (
            <button
              key={item}
              className={
                part === item
                  ? 'part-button active'
                  : 'part-button'
              }
              onClick={() => setPart(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="note-grid">
        <div className="note-card">
          <div className="label">
            TARGET NOTE
          </div>

          <div className="note-text">
            G4
          </div>
        </div>

        <div className="note-card">
          <div className="label">
            YOUR NOTE
          </div>

          <div className="note-text">
            {note}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="label">
          PITCH OFFSET
        </div>

        <div className="offset-text">
          {centsOff} cents
        </div>
      </div>

      <div className="card">
        <div className="label">
          MIC INPUT
        </div>

        <div className="offset-text">
          {frequency
            ? `${frequency} Hz`
            : '-- Hz'}
        </div>

        <Meter
          label="Input level"
          value={volume}
        />

        <button
          className="upload-button"
          onClick={
            isListening
              ? stopListening
              : startListening
          }
        >
          {isListening
            ? 'Stop Mic'
            : 'Start Mic'}
        </button>
      </div>

      <div className="score-circle">
        <div className="score-number">
          81
        </div>

        <div className="score-label">
          OVERALL SCORE
        </div>
      </div>

      <Meter
        label="Pitch accuracy"
        value={pitchScore}
      />

      <Meter
        label="Timing accuracy"
        value={timingScore}
      />
    </div>
  );
}
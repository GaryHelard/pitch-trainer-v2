import { useEffect, useRef, useState } from 'react';

import AnalysisBox from '../components/AnalysisBox';
import Meter from '../components/Meter';
import TransportControls from '../components/TransportControls';
import WaveformVisualizer from '../components/WaveformVisualizer';

import useMicrophonePitch from '../hooks/useMicrophonePitch';
import useAudioPlayer from '../hooks/useAudioPlayer';

import {
  generateMockTimeline,
  getCurrentTimelineNote,
} from '../audio/noteTimeline';

import type {
  TimelineNote,
} from '../audio/noteTimeline';

import './RehearseScreen.css';

const PARTS = [
  'Bass',
  'Baritone',
  'Lead',
  'Tenor',
];

export default function RehearseScreen() {
  const [part, setPart] = useState('Lead');

  const [pitchScore, setPitchScore] =
    useState(0);

  const [timingScore, setTimingScore] =
    useState(0);

  const [sheetFile, setSheetFile] =
    useState<File | null>(null);

  const [detectedKey, setDetectedKey] =
    useState('--');

  const [timeSignature, setTimeSignature] =
    useState('--');

  const [tempo, setTempo] =
    useState('--');

  const [feel, setFeel] =
    useState('--');

  const [timeline, setTimeline] =
    useState<TimelineNote[]>([]);

  const [targetNote, setTargetNote] =
    useState('--');

  const audioInputRef =
    useRef<HTMLInputElement | null>(null);

  const sheetInputRef =
    useRef<HTMLInputElement | null>(null);

  const {
    isListening,
    frequency,
    note,
    centsOff,
    volume,
    analyserNode,
    startListening,
    stopListening,
  } = useMicrophonePitch();

  const {
    audioFile,
    audioUrl,
    isPlaying,
    position,
    duration,
    loadAudioFile,
    attachAudioElement,
    playPause,
    stop,
    skip,
    onTimeUpdate,
    onLoadedMetadata,
    onPlay,
    onPause,
    formatTime,
  } = useAudioPlayer();

  useEffect(() => {
    const currentTimelineNote =
      getCurrentTimelineNote(
        timeline,
        position
      );

    if (currentTimelineNote) {
      setTargetNote(
        currentTimelineNote.note
      );

      if (
        note &&
        note !== '--'
      ) {
        const score =
          Math.max(
            0,
            100 - Math.abs(centsOff) * 2
          );

        setPitchScore(
          Math.round(score)
        );

        setTimingScore(
          Math.round(
            80 + Math.random() * 20
          )
        );
      }
    }
  }, [
    position,
    timeline,
    note,
    centsOff,
  ]);

  function handleAudioUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    loadAudioFile(file);

    const generatedTimeline =
      generateMockTimeline();

    setTimeline(generatedTimeline);
  }

  function handleSheetUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setSheetFile(file);

    setDetectedKey('E♭ major');
    setTimeSignature('4/4');
    setTempo('♩ = 130');
    setFeel('Swing');
  }

  const overallScore =
    Math.round(
      (pitchScore + timingScore) / 2
    );

  return (
    <div className="rehearse-screen">
      <h1 className="screen-title">
        Rehearse
      </h1>

      <p className="screen-subtitle">
        Upload audio and sheet music,
        then compare your singing.
      </p>

      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        style={{ display: 'none' }}
        onChange={handleAudioUpload}
      />

      <button
        className="upload-button"
        onClick={() =>
          audioInputRef.current?.click()
        }
      >
        Upload Reference Audio
      </button>

      <input
        ref={sheetInputRef}
        type="file"
        accept=".pdf,image/*"
        style={{ display: 'none' }}
        onChange={handleSheetUpload}
      />

      <button
        className="sheet-button"
        onClick={() =>
          sheetInputRef.current?.click()
        }
      >
        Upload Sheet Music PDF
      </button>

      {audioFile && (
        <div className="card">
          <div className="label">
            AUDIO FILE
          </div>

          <div className="file-name">
            {audioFile.name}
          </div>
        </div>
      )}

      {sheetFile && (
        <div className="card">
          <div className="label">
            SHEET MUSIC
          </div>

          <div className="file-name">
            {sheetFile.name}
          </div>
        </div>
      )}

      {audioUrl && (
        <audio
          ref={attachAudioElement}
          src={audioUrl}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onPlay={onPlay}
          onPause={onPause}
        />
      )}

      <div className="analysis-grid">
        <AnalysisBox
          label="KEY"
          value={detectedKey}
        />

        <AnalysisBox
          label="TIME"
          value={timeSignature}
        />

        <AnalysisBox
          label="TEMPO"
          value={tempo}
        />

        <AnalysisBox
          label="FEEL"
          value={feel}
        />
      </div>

      <TransportControls
        isPlaying={isPlaying}
        disabled={!audioFile}
        onPlayPause={playPause}
        onStop={stop}
        onSkipBack={() => skip(-5)}
        onSkipForward={() => skip(5)}
      />

      <div className="card">
        <div className="label">
          PLAYBACK
        </div>

        <div className="file-name">
          {formatTime(position)} /{' '}
          {formatTime(duration)}
        </div>
      </div>

      <WaveformVisualizer
        analyser={analyserNode}
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
              onClick={() =>
                setPart(item)
              }
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
            {targetNote}
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

        <div
          className={
            Math.abs(centsOff) <= 10
              ? 'offset-text good'
              : Math.abs(centsOff) <= 25
              ? 'offset-text okay'
              : 'offset-text bad'
          }
        >
          {centsOff > 0 ? '+' : ''}
          {centsOff} cents
        </div>

        <div className="pitch-feedback">
          {Math.abs(centsOff) <= 10
            ? 'Excellent pitch match'
            : centsOff > 0
            ? 'You are sharp'
            : 'You are flat'}
        </div>

        <div className="tuning-bar">
          <div className="tuning-center" />

          <div
            className="tuning-indicator"
            style={{
              left: `calc(50% + ${Math.max(
                -45,
                Math.min(45, centsOff)
              )}%)`,
            }}
          />
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
          {overallScore}
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
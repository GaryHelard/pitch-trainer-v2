import { useEffect, useRef, useState } from 'react';

import {
  autoCorrelate,
  frequencyToNote,
  centsOffFromNote,
} from '../audio/pitchDetection';

export default function useMicrophonePitch() {
  const [isListening, setIsListening] = useState(false);
  const [frequency, setFrequency] = useState(null);
  const [note, setNote] = useState('--');
  const [centsOff, setCentsOff] = useState(0);
  const [volume, setVolume] = useState(0);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  async function startListening() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 2048;

    const source =
      audioContext.createMediaStreamSource(stream);

    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    streamRef.current = stream;

    setIsListening(true);

    analyse();
  }

  function stopListening() {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setIsListening(false);
    setFrequency(null);
    setNote('--');
    setCentsOff(0);
    setVolume(0);
  }

  function analyse() {
    const analyser = analyserRef.current;
    const audioContext = audioContextRef.current;

    if (!analyser || !audioContext) return;

    const buffer = new Float32Array(analyser.fftSize);

    analyser.getFloatTimeDomainData(buffer);

    const detectedFrequency = autoCorrelate(
      buffer,
      audioContext.sampleRate
    );

    let rms = 0;

    for (let i = 0; i < buffer.length; i++) {
      rms += buffer[i] * buffer[i];
    }

    rms = Math.sqrt(rms / buffer.length);

    setVolume(Math.min(100, Math.round(rms * 400)));

    if (detectedFrequency) {
      setFrequency(Math.round(detectedFrequency));
      setNote(frequencyToNote(detectedFrequency));
      setCentsOff(centsOffFromNote(detectedFrequency));
    }

    animationRef.current =
      requestAnimationFrame(analyse);
  }

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return {
    isListening,
    frequency,
    note,
    centsOff,
    volume,
    startListening,
    stopListening,
  };
}
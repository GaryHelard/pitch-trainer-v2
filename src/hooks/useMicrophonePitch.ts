import { useEffect, useRef, useState } from 'react';

import {
  autoCorrelate,
  centsOffFromNote,
  frequencyToNote,
} from '../audio/pitchDetection';

export default function useMicrophonePitch() {
  const [isListening, setIsListening] =
    useState<boolean>(false);

  const [frequency, setFrequency] =
    useState<number | null>(null);

  const [note, setNote] =
    useState<string>('--');

  const [centsOff, setCentsOff] =
    useState<number>(0);

  const [volume, setVolume] =
    useState<number>(0);

  const [analyserNode, setAnalyserNode] =
    useState<AnalyserNode | null>(null);

  const audioContextRef =
    useRef<AudioContext | null>(null);

  const analyserRef =
    useRef<AnalyserNode | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const animationRef =
    useRef<number | null>(null);

  async function startListening(): Promise<void> {
    const stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

    const audioContext = new AudioContext();

    const analyser =
      audioContext.createAnalyser();

    analyser.fftSize = 2048;

    const source =
      audioContext.createMediaStreamSource(stream);

    source.connect(analyser);

    audioContextRef.current =
      audioContext;

    analyserRef.current = analyser;

    streamRef.current = stream;

    setAnalyserNode(analyser);

    setIsListening(true);

    analyse();
  }

  function stopListening(): void {
    if (animationRef.current !== null) {
      cancelAnimationFrame(
        animationRef.current
      );
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    audioContextRef.current = null;
    analyserRef.current = null;
    streamRef.current = null;
    animationRef.current = null;

    setAnalyserNode(null);

    setIsListening(false);
    setFrequency(null);
    setNote('--');
    setCentsOff(0);
    setVolume(0);
  }

  function analyse(): void {
    const analyser =
      analyserRef.current;

    const audioContext =
      audioContextRef.current;

    if (!analyser || !audioContext) return;

    const buffer =
      new Float32Array(analyser.fftSize);

    analyser.getFloatTimeDomainData(buffer);

    const detectedFrequency =
      autoCorrelate(
        buffer,
        audioContext.sampleRate
      );

    let rms = 0;

    for (
      let i = 0;
      i < buffer.length;
      i += 1
    ) {
      rms += buffer[i] * buffer[i];
    }

    rms = Math.sqrt(rms / buffer.length);

    setVolume(
      Math.min(
        100,
        Math.round(rms * 400)
      )
    );

    if (detectedFrequency) {
      setFrequency(
        Math.round(detectedFrequency)
      );

      setNote(
        frequencyToNote(
          detectedFrequency
        )
      );

      setCentsOff(
        centsOffFromNote(
          detectedFrequency
        )
      );
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
    analyserNode,
    startListening,
    stopListening,
  };
}
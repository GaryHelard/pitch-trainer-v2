import { useRef, useState } from 'react';

export default function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');

  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  function loadAudioFile(file: File) {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    const nextUrl = URL.createObjectURL(file);

    setAudioFile(file);
    setAudioUrl(nextUrl);
    setPosition(0);
    setDuration(0);
    setIsPlaying(false);
  }

  function attachAudioElement(element: HTMLAudioElement | null) {
    audioRef.current = element;
  }

  function playPause() {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  function stop() {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setPosition(0);
  }

  function skip(seconds: number) {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = Math.max(
      0,
      Math.min(audio.duration || 0, audio.currentTime + seconds)
    );
  }

  function onTimeUpdate() {
    const audio = audioRef.current;

    if (!audio) return;

    setPosition(audio.currentTime);
  }

  function onLoadedMetadata() {
    const audio = audioRef.current;

    if (!audio) return;

    setDuration(audio.duration || 0);
  }

  function onPlay() {
    setIsPlaying(true);
  }

  function onPause() {
    setIsPlaying(false);
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  return {
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
  };
}
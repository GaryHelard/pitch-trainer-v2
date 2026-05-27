export function autoCorrelate(
  buffer: Float32Array,
  sampleRate: number
): number | null {
  const size = buffer.length;
  let rms = 0;

  for (let i = 0; i < size; i += 1) {
    const value = buffer[i];
    rms += value * value;
  }

  rms = Math.sqrt(rms / size);

  if (rms < 0.01) return null;

  let bestOffset = -1;
  let bestCorrelation = 0;

  for (let offset = 1; offset < size; offset += 1) {
    let correlation = 0;

    for (let i = 0; i < size - offset; i += 1) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }

    correlation = 1 - correlation / (size - offset);

    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }

  if (bestCorrelation > 0.9 && bestOffset > 0) {
    return sampleRate / bestOffset;
  }

  return null;
}

export function frequencyToNote(frequency: number): string {
  const noteNames = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];

  const midi = Math.round(12 * Math.log2(frequency / 440) + 69);
  const note = noteNames[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;

  return `${note}${octave}`;
}

export function centsOffFromNote(frequency: number): number {
  const midiExact = 12 * Math.log2(frequency / 440) + 69;
  const midiRounded = Math.round(midiExact);

  return Math.round((midiExact - midiRounded) * 100);
}
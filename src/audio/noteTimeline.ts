export type TimelineNote = {
    time: number;
    duration: number;
    note: string;
    frequency: number;
  };
  
  const NOTES = [
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
  
  export function frequencyToNoteName(
    frequency: number
  ): string {
    const midi =
      Math.round(
        12 * Math.log2(frequency / 440) + 69
      );
  
    const note =
      NOTES[((midi % 12) + 12) % 12];
  
    const octave =
      Math.floor(midi / 12) - 1;
  
    return `${note}${octave}`;
  }
  
  export function generateMockTimeline(): TimelineNote[] {
    const frequencies = [
      392.0,
      440.0,
      493.88,
      523.25,
      587.33,
      659.25,
      698.46,
      783.99,
    ];
  
    return frequencies.map(
      (frequency, index) => ({
        time: index * 1.2,
        duration: 1.1,
        frequency,
        note:
          frequencyToNoteName(frequency),
      })
    );
  }
  
  export function getCurrentTimelineNote(
    timeline: TimelineNote[],
    currentTime: number
  ): TimelineNote | null {
    for (const note of timeline) {
      if (
        currentTime >= note.time &&
        currentTime <=
          note.time + note.duration
      ) {
        return note;
      }
    }
  
    return null;
  }
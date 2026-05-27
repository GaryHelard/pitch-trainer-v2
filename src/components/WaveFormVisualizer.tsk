import { useEffect, useRef } from 'react';

type WaveformVisualizerProps = {
  analyser: AnalyserNode | null;
};

export default function WaveformVisualizer({
  analyser,
}: WaveformVisualizerProps) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!analyser) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const buffer = new Uint8Array(
      analyser.fftSize
    );

    let animationFrame = 0;

    function draw() {
      analyser.getByteTimeDomainData(buffer);

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.fillStyle = '#11111a';

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#18d8f0';

      ctx.beginPath();

      const sliceWidth =
        canvas.width / buffer.length;

      let x = 0;

      for (let i = 0; i < buffer.length; i++) {
        const v = buffer[i] / 128.0;

        const y =
          (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(
        canvas.width,
        canvas.height / 2
      );

      ctx.stroke();

      animationFrame =
        requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [analyser]);

  return (
    <canvas
      ref={canvasRef}
      width={900}
      height={180}
      style={{
        width: '100%',
        height: '180px',
        borderRadius: '18px',
        background: '#11111a',
        border: '1px solid #242637',
        marginBottom: '18px',
      }}
    />
  );
}
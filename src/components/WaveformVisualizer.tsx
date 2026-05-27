import { useEffect, useRef } from 'react';

type WaveformVisualizerProps = {
  analyser: AnalyserNode | null;
};

export default function WaveformVisualizer({
  analyser,
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!analyser) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const activeAnalyser = analyser;
    const activeCanvas = canvas;
    const activeCtx = ctx;

    const buffer = new Uint8Array(activeAnalyser.fftSize);

    let animationFrame = 0;

    function draw() {
      activeAnalyser.getByteTimeDomainData(buffer);

      activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);

      activeCtx.fillStyle = '#11111a';
      activeCtx.fillRect(0, 0, activeCanvas.width, activeCanvas.height);

      activeCtx.lineWidth = 2;
      activeCtx.strokeStyle = '#18d8f0';

      activeCtx.beginPath();

      const sliceWidth = activeCanvas.width / buffer.length;
      let x = 0;

      for (let i = 0; i < buffer.length; i += 1) {
        const v = buffer[i] / 128;
        const y = (v * activeCanvas.height) / 2;

        if (i === 0) {
          activeCtx.moveTo(x, y);
        } else {
          activeCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      activeCtx.lineTo(activeCanvas.width, activeCanvas.height / 2);
      activeCtx.stroke();

      animationFrame = requestAnimationFrame(draw);
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
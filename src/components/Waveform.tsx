import { useEffect, useRef } from "react";

export default function Waveform({ stream }: { stream: MediaStream | null }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!stream) return;

    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      dataArray.forEach((value) => {
        const barHeight = value * 0.8;

        ctx.fillStyle = "#4f46e5"; // Indigo
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      });
    }

    draw();
  }, [stream]);

  return <canvas ref={canvasRef} width={280} height={80} className="rounded-lg"></canvas>;
}

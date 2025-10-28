"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Siri-style recorder visualizer component.
 * - Provides Start / Stop controls
 * - Draws the colourful 3-layer curve using the analyser frequency data
 */
const WIDTH = 1000;
const HEIGHT = 300;

const defaultOpts = {
  smoothing: 0.6,
  fft: 8,
  minDecibels: -70,
  scale: 0.15,
  glow: 1,
  color1: [203, 36, 128],
  color2: [41, 200, 192],
  color3: [24, 137, 218],
  fillOpacity: 0.6,
  lineWidth: 1,
  blend: "screen",
  shift: 50,
  width: 60,
  amp: 0.8
};

export default function SiriRecorder() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const freqsRef = useRef<Uint8Array | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const opts = useRef({ ...defaultOpts });

  useEffect(() => {
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function range(i: number) {
    return Array.from(Array(i).keys());
  }

  const shuffle = [1, 3, 0, 4, 2];

  function freq(channel: number, i: number, freqs: Uint8Array) {
    const band = 2 * channel + shuffle[i] * 6;
    return freqs[band];
  }

  function scale(i: number) {
    const x = Math.abs(2 - i);
    const s = 3 - x;
    return (s / 3) * opts.current.amp;
  }

  function path(ctx: CanvasRenderingContext2D, freqs: Uint8Array, channel: number) {
    const WIDTH_LOCAL = canvasRef.current?.width ?? WIDTH;
    const HEIGHT_LOCAL = canvasRef.current?.height ?? HEIGHT;
    const color = opts.current[`color${channel + 1}` as keyof typeof opts.current] as number[];
    ctx.fillStyle = `rgba(${color}, ${opts.current.fillOpacity})`;
    ctx.strokeStyle = ctx.shadowColor = `rgb(${color})`;
    ctx.lineWidth = opts.current.lineWidth;
    ctx.shadowBlur = opts.current.glow;
    ctx.globalCompositeOperation = opts.current.blend as GlobalCompositeOperation;

    const m = HEIGHT / 2;
    const totalWaveWidth = 15 * opts.current.width + opts.current.shift * 2;
    const offset = (WIDTH - totalWaveWidth) / 2;
    const x = range(15).map((i) => offset + channel * opts.current.shift + i * opts.current.width);

    const y = range(5).map((i) => Math.max(0, m - scale(i) * freq(channel, i, freqs)));
    const h = 2 * m;

    ctx.beginPath();
    ctx.moveTo(0, m);
    ctx.lineTo(x[0], m + 1);
    ctx.bezierCurveTo(x[1], m + 1, x[2], y[0], x[3], y[0]);
    ctx.bezierCurveTo(x[4], y[0], x[4], y[1], x[5], y[1]);
    ctx.bezierCurveTo(x[6], y[1], x[6], y[2], x[7], y[2]);
    ctx.bezierCurveTo(x[8], y[2], x[8], y[3], x[9], y[3]);
    ctx.bezierCurveTo(x[10], y[3], x[10], y[4], x[11], y[4]);
    ctx.bezierCurveTo(x[12], y[4], x[12], m, x[13], m);
    ctx.lineTo(WIDTH, m + 1);
    ctx.lineTo(x[13], m - 1);

    ctx.bezierCurveTo(x[12], m, x[12], h - y[4], x[11], h - y[4]);
    ctx.bezierCurveTo(x[10], h - y[4], x[10], h - y[3], x[9], h - y[3]);
    ctx.bezierCurveTo(x[8], h - y[3], x[8], h - y[2], x[7], h - y[2]);
    ctx.bezierCurveTo(x[6], h - y[2], x[6], h - y[1], x[5], h - y[1]);
    ctx.bezierCurveTo(x[4], h - y[1], x[4], h - y[0], x[3], h - y[0]);
    ctx.bezierCurveTo(x[2], h - y[0], x[1], m, x[0], m);
    ctx.lineTo(0, m);

    ctx.fill();
    ctx.stroke();
  }

  function visualize() {
    const analyser = analyserRef.current;
    const freqs = freqsRef.current;
    const canvas = canvasRef.current;
    if (!analyser || !freqs || !canvas) return;

    analyser.smoothingTimeConstant = opts.current.smoothing;
    analyser.fftSize = Math.pow(2, opts.current.fft);
    analyser.minDecibels = opts.current.minDecibels;
    analyser.maxDecibels = 0;
    analyser.getByteFrequencyData(freqs as any);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear and set size for high-DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    canvas.style.width = `${WIDTH}px`;
    canvas.style.height = `${HEIGHT}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    path(ctx, freqs, 0);
    path(ctx, freqs, 1);
    path(ctx, freqs, 2);

    animationRef.current = requestAnimationFrame(visualize);
  }

  async function start() {
    if (isRunning) return;
    try {
      const ac = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ac;
      const analyser = ac.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = Math.pow(2, opts.current.fft);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const input = ac.createMediaStreamSource(stream);
      input.connect(analyser);

      freqsRef.current = new Uint8Array(analyser.frequencyBinCount);
      setIsRunning(true);
      // start loop
      animationRef.current = requestAnimationFrame(visualize);
    } catch (err) {
      console.error("Failed to start audio visualizer", err);
    }
  }

  function stop() {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // ignore
      }
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    freqsRef.current = null;
    setIsRunning(false);
  }

  return (
    <div className="w-full">
      <div className="rounded-md border border-gray-200 overflow-hidden bg-white p-4">
        <div className="flex items-center justify-start gap-4 mb-3">
          <div className="flex gap-2">
            {!isRunning ? (
              <button className="px-3 py-1 rounded bg-green-600 text-white text-sm" onClick={start}>
                Start
              </button>
            ) : (
              <button className="px-3 py-1 rounded bg-red-600 text-white text-sm" onClick={stop}>
                Stop
              </button>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold">Siri Recorder Visualizer</h4>
            <p className="text-xs text-gray-500">Live microphone visualizer — click Start to grant microphone access</p>
          </div>

        </div>

        {isRunning && <div className="w-full overflow-hidden rounded-xl">
          <canvas ref={canvasRef} style={{ width: WIDTH, height: HEIGHT, borderRadius: 12, background: 'linear-gradient(135deg, rgba(0,0,0,0.65) 40%, rgba(0, 0, 0, 0.8) 100%)' }} />

        </div>}
      </div>
    </div>
  );
}

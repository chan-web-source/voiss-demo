"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Siri-style recorder visualizer component for mobile devices.
 * - Provides Start / Stop controls
 * - Draws the colourful 3-layer curve using the analyser frequency data
 * - Optimized for smaller mobile screens
 */
const WIDTH = 360;
const HEIGHT = 220;



export default function SiriRecorderMobile() {

 const defaultOpts = {
  smoothing: 0.6,
  fft: 8,
  minDecibels: -70,
  scale: 0.1,
  glow: 3,
  color1: [203, 36, 128],
  color2: [41, 200, 192],
  color3: [24, 137, 218],
  fillOpacity: 0.8,
  lineWidth: 2,
  blend: "screen",
  shift: 30,
  width: 50,
  amp: 0.8
 };

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
   <div className="rounded-md border border-gray-200 overflow-hidden bg-white p-3">
    <div className="flex items-center justify-start gap-3 mb-2">
     <div className="flex gap-2">
      {!isRunning ? (
       <button className="px-2 py-1 rounded bg-green-600 text-white text-xs" onClick={start}>
        Start
       </button>
      ) : (
       <button className="px-2 py-1 rounded bg-red-600 text-white text-xs" onClick={stop}>
        Stop
       </button>
      )}
     </div>
     <div>
      <h4 className="text-xs font-semibold">Siri Recorder</h4>
      <p className="text-xs text-gray-500">Mobile visualizer</p>
     </div>
    </div>

    {isRunning && (
     <div className=" overflow-hidden rounded-lg">
      <canvas
       ref={canvasRef}
       style={{
        width: WIDTH,
        height: HEIGHT,
        borderRadius: 6,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 40%, rgba(0, 0, 0, 0.9) 100%)',
        // maxWidth: '100%',
       }}
      />
     </div>
    )}
   </div>
  </div>
 );
}

"use client"

import { useEffect, useRef } from "react"
// import type { MediaElementAudioSourceNode } from "standardized-audio-context"

interface AudioVisualizerProps {
 mp3Url: string
 isPlaying: boolean
 audioElement?: HTMLAudioElement | null
}

export function AudioVisualizer({ mp3Url, isPlaying, audioElement }: AudioVisualizerProps) {
 const canvasRef = useRef<HTMLCanvasElement>(null)
 const audioContextRef = useRef<AudioContext | null>(null)
 const analyserRef = useRef<AnalyserNode | null>(null)
 const animationIdRef = useRef<number | null>(null)
 const sourceRef = useRef<any>(null)
 const smoothedDataRef = useRef<number[]>([])
 const smoothedWidthRef = useRef<number[]>([])

 useEffect(() => {
  return () => {
   if (animationIdRef.current) {
    cancelAnimationFrame(animationIdRef.current)
   }
  }
 }, [])

 useEffect(() => {
  if (isPlaying && mp3Url && audioElement) {
   handlePlay()
  } else {
   handlePause()
  }
 }, [isPlaying, mp3Url, audioElement])

 const initAudioContext = () => {
  if (audioContextRef.current && sourceRef.current) return

  try {
   const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
   const analyser = audioContext.createAnalyser()
   analyser.fftSize = 256

   if (!sourceRef.current && audioElement) {
    const source = audioContext.createMediaElementSource(audioElement)
    source.connect(analyser)
    analyser.connect(audioContext.destination)
    sourceRef.current = source
   }

   audioContextRef.current = audioContext
   analyserRef.current = analyser

   if (audioContext.state === "suspended") {
    audioContext.resume()
   }
  } catch (error) {
   console.error("[v0] Error initializing audio context:", error)
  }
 }

 const draw = () => {
  const canvas = canvasRef.current
  if (!canvas || !analyserRef.current) return

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  if (canvas.width <= 0 || canvas.height <= 0) {
   animationIdRef.current = requestAnimationFrame(draw)
   return
  }

  const bufferLength = analyserRef.current.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  analyserRef.current.getByteFrequencyData(dataArray)

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const numBars = 18 // Reduce bars to ensure better fit
  const barWidth = 4
  const barGap = 2 // Minimal gap
  const totalWidth = numBars * (barWidth + barGap) - barGap
  const canvasWidth = canvas.width
  const centerY = canvas.height / 2
  const maxBarHeight = canvas.height * 0.75

  // Initialize smoothed data arrays
  if (smoothedDataRef.current.length === 0) {
   smoothedDataRef.current = new Array(numBars).fill(0)
  }
  if (smoothedWidthRef.current.length === 0) {
   smoothedWidthRef.current = new Array(numBars).fill(barWidth)
  }

  const startFreqBin = 20
  const endFreqBin = 200
  const frequencyRange = endFreqBin - startFreqBin
  const smoothingFactor = 0.7

  // Calculate positions for both left and right sides - completely remove gap
  const leftStartX = (canvasWidth - totalWidth * 2) / 2
  const rightStartX = leftStartX + (barGap * 2.5)// Direct connection

  for (let i = 0; i < numBars; i++) {
   const position = i / (numBars - 1)

   let waveMultiplier = 0
   if (position >= 0.2 && position <= 0.8) {
    // Only apply wave effect to middle 60% of bars
    const normalizedPosition = (position - 0.2) / 0.6
    waveMultiplier = Math.pow(Math.cos((normalizedPosition - 0.5) * Math.PI), 4)
   }
   // Bars outside 0.2-0.8 range remain completely flat (multiplier = 0)

   const frequencyIndex = Math.floor(startFreqBin + position * frequencyRange)
   const audioIntensity = dataArray[frequencyIndex] / 255

   if (!Number.isFinite(audioIntensity)) {
    continue
   }

   const finalIntensity = audioIntensity * waveMultiplier
   const barHeight = finalIntensity * maxBarHeight
   const barWidthDynamic = barWidth + (finalIntensity * 2) // Dynamic width based on intensity

   smoothedDataRef.current[i] = smoothedDataRef.current[i] * smoothingFactor + barHeight * (1 - smoothingFactor)
   smoothedWidthRef.current[i] = smoothedWidthRef.current[i] * smoothingFactor + barWidthDynamic * (1 - smoothingFactor)

   let finalHeight = smoothedDataRef.current[i]
   let finalWidth = smoothedWidthRef.current[i]

   if (!Number.isFinite(finalHeight)) {
    finalHeight = 0
   }
   if (!Number.isFinite(finalWidth)) {
    finalWidth = barWidth
   }

   if (!Number.isFinite(finalIntensity)) {
    continue
   }


   const x = leftStartX + i * (barWidth + barGap)
   const mirroredX = rightStartX + (numBars - 1 - i) * (barWidth + barGap)

   const y1 = centerY - finalHeight
   const y2 = centerY + finalHeight

   if (!Number.isFinite(x) || !Number.isFinite(mirroredX) || !Number.isFinite(y1) || !Number.isFinite(y2)) {
    continue
   }

   // Pure black color - no gradient
   ctx.fillStyle = '#000000'
   ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
   ctx.shadowBlur = 1
   ctx.shadowOffsetX = 0
   ctx.shadowOffsetY = 0

   // Draw very rounded rectangles - much more rounded
   const radius = barWidth / 2 // Much more rounded - half the bar width

   // Left side bars
   ctx.beginPath()
   ctx.roundRect(x, centerY - finalHeight, finalWidth, finalHeight)
   ctx.fill()

   ctx.beginPath()
   ctx.roundRect(x, centerY, finalWidth, finalHeight)
   ctx.fill()


   // Right side bars - flip horizontally using fillRect with negative width
   ctx.fillRect(mirroredX, centerY - finalHeight, -finalWidth, finalHeight)
   ctx.fillRect(mirroredX, centerY, -finalWidth, finalHeight)
  }

  ctx.shadowBlur = 0
  animationIdRef.current = requestAnimationFrame(draw)
 }

 const handlePlay = async () => {
  if (!audioElement) return

  try {
   initAudioContext()

   if (audioContextRef.current?.state === "suspended") {
    await audioContextRef.current.resume()
   }

   draw()
  } catch (error) {
   console.error("[v0] Error initializing visualizer:", error)
  }
 }

 const handlePause = () => {
  if (animationIdRef.current) {
   cancelAnimationFrame(animationIdRef.current)
  }
 }

 return (
  <div>
   <canvas
    ref={canvasRef}
    width={200}
    height={80}
    className="rounded-lg"
    style={{
     borderRadius: "14px",
    }}
   />
  </div>
 )
}

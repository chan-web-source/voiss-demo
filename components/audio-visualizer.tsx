"use client"

import { useEffect, useRef, useState } from "react"
// import type { MediaElementAudioSourceNode } from "standardized-audio-context"

interface AudioVisualizerProps {
 mp3Url: string
 isPlaying: boolean
}

export function AudioVisualizer({ mp3Url, isPlaying }: AudioVisualizerProps) {
 const canvasRef = useRef<HTMLCanvasElement>(null)
 const audioContextRef = useRef<AudioContext | null>(null)
 const analyserRef = useRef<AnalyserNode | null>(null)
 const audioElementRef = useRef<HTMLAudioElement | null>(null)
 const animationIdRef = useRef<number | null>(null)
 // const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
 const sourceRef = useRef<any>(null)

 useEffect(() => {
  return () => {
   if (animationIdRef.current) {
    cancelAnimationFrame(animationIdRef.current)
   }
  }
 }, [])

 // Handle play/pause based on parent state
 useEffect(() => {
  if (!audioElementRef.current) return

  if (isPlaying && mp3Url) {
   handlePlay()
  } else {
   handlePause()
  }
 }, [isPlaying, mp3Url])

 const initAudioContext = () => {
  if (audioContextRef.current && sourceRef.current) return

  try {
   const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
   const analyser = audioContext.createAnalyser()
   analyser.fftSize = 256

   if (!sourceRef.current && audioElementRef.current) {
    const source = audioContext.createMediaElementSource(audioElementRef.current)
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

  const bufferLength = analyserRef.current.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  analyserRef.current.getByteFrequencyData(dataArray)

  // Clear canvas with transparent background
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const numBars = 9
  const barWidth = 8
  const barGap = 4
  const totalWidth = numBars * (barWidth + barGap) - barGap
  const startX = (canvas.width - totalWidth) / 2 // Center horizontally
  const centerY = canvas.height / 2

  // Skip very low frequencies (0-20) and focus on 20-200 range for better voice visualization
  const startFreqBin = 20
  const endFreqBin = 200
  const frequencyRange = endFreqBin - startFreqBin

  for (let i = 0; i < numBars; i++) {
   // Center bars (3-5) get the strongest frequencies, edges get weaker ones
   const position = i / (numBars - 1) // 0 to 1
   const frequencyIndex = Math.floor(startFreqBin + position * frequencyRange)
   const barHeight = (dataArray[frequencyIndex] / 255) * (canvas.height - 10)
   const x = startX + i * (barWidth + barGap)

   // Create gradient from black to gray based on position
   const intensity = dataArray[frequencyIndex] / 255
   const grayValue = Math.floor(20 + intensity * 180) // From black (20) to light gray (200)

   ctx.fillStyle = `rgb(${grayValue}, ${grayValue}, ${grayValue})`

   // Draw bar extending upward from center
   ctx.fillRect(x, centerY - barHeight, barWidth, barHeight)

   // Draw mirrored bar extending downward from center
   ctx.fillRect(x, centerY, barWidth, barHeight)
  }

  animationIdRef.current = requestAnimationFrame(draw)
 }

 const handlePlay = async () => {
  if (!audioElementRef.current) return

  try {
   initAudioContext()

   if (audioContextRef.current?.state === "suspended") {
    await audioContextRef.current.resume()
   }

   await audioElementRef.current.play()
   draw()
  } catch (error) {
   console.error("[v0] Error playing audio:", error)
  }
 }

 const handlePause = () => {
  if (!audioElementRef.current) return

  audioElementRef.current.pause()
  if (animationIdRef.current) {
   cancelAnimationFrame(animationIdRef.current)
  }
 }

 const handleAudioEnd = () => {
  if (animationIdRef.current) {
   cancelAnimationFrame(animationIdRef.current)
  }
 }

 return (
  <>
   <audio ref={audioElementRef} src={mp3Url} onEnded={handleAudioEnd} crossOrigin="anonymous" />
   <canvas ref={canvasRef} width={200} height={40} />
  </>
 )
}

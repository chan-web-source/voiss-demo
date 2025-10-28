"use client"

import { useEffect, useRef } from "react"

interface SiriVisualizerProps {
 mp3Url: string
 isPlaying: boolean
 audioElement?: HTMLAudioElement | null
}

export function SiriVisualizer({ mp3Url, isPlaying, audioElement }: SiriVisualizerProps) {
 const canvasRef = useRef<HTMLCanvasElement>(null)
 const audioContextRef = useRef<AudioContext | null>(null)
 const analyserRef = useRef<AnalyserNode | null>(null)
 const animationIdRef = useRef<number | null>(null)
 const sourceRef = useRef<any>(null)
 const freqsRef = useRef<Uint8Array | null>(null)

 const WIDTH = 1000
 const HEIGHT = 400

 // options to tweak the look
 const opts = {
  smoothing: 0.6,
  fft: 8,
  minDecibels: -70,
  scale: 0.2,
  glow: 10,
  color1: [203, 36, 128],
  color2: [41, 200, 192],
  color3: [24, 137, 218],
  fillOpacity: 0.6,
  lineWidth: 1,
  blend: "screen" as GlobalCompositeOperation,
  shift: 50,
  width: 60,
  amp: 1
 }

 // shuffle frequencies so that neighbors are not too similar
 const shuffle = [1, 3, 0, 4, 2]

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
   analyser.fftSize = Math.pow(2, opts.fft)
   analyser.minDecibels = opts.minDecibels
   analyser.maxDecibels = 0

   if (!sourceRef.current && audioElement) {
    const source = audioContext.createMediaElementSource(audioElement)
    source.connect(analyser)
    analyser.connect(audioContext.destination)
    sourceRef.current = source
   }

   audioContextRef.current = audioContext
   analyserRef.current = analyser
   freqsRef.current = new Uint8Array(analyser.frequencyBinCount)

   if (audioContext.state === "suspended") {
    audioContext.resume()
   }
  } catch (error) {
   console.error("[Siri] Error initializing audio context:", error)
  }
 }

 // Utility function to create a number range
 const range = (i: number) => Array.from(Array(i).keys())

 /**
  * Pick a frequency for the given channel and value index.
  */
 const freq = (channel: number, i: number) => {
  if (!freqsRef.current) return 0
  const band = 2 * channel + shuffle[i] * 6
  return freqsRef.current[band] || 0
 }

 /**
  * Returns the scale factor for the given value index.
  */
 const scale = (i: number) => {
  const x = Math.abs(2 - i) // 2,1,0,1,2
  const s = 3 - x           // 1,2,3,2,1
  return s / 3 * opts.amp
 }

 /**
  * This function draws a path that roughly looks like this:
  *       .
  * __/\_/ \_/\__
  *   \/ \ / \/
  *       '
  *   1 2 3 4 5
  */
 const path = (ctx: CanvasRenderingContext2D, channel: number) => {
  // Read color1, color2, color2 from the opts
  const color = opts[`color${channel + 1}` as keyof typeof opts] as number[]

  // turn the [r,g,b] array into a rgba() css color
  ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opts.fillOpacity})`

  // set stroke and shadow the same solid rgb() color
  ctx.strokeStyle = ctx.shadowColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`

  ctx.lineWidth = opts.lineWidth
  ctx.shadowBlur = opts.glow
  ctx.globalCompositeOperation = opts.blend

  const m = HEIGHT / 2 // the vertical middle of the canvas

  // for the curve with 5 peaks we need 15 control points
  // calculate how much space is left around it
  const offset = (WIDTH - 15 * opts.width) / 2

  // calculate the 15 x-offsets
  const x = range(15).map(
   i => offset + channel * opts.shift + i * opts.width
  )

  // pick some frequencies to calculate the y values
  // scale based on position so that the center is always bigger
  const y = range(5).map(i =>
   Math.max(0, m - scale(i) * freq(channel, i))
  )

  const h = 2 * m

  ctx.beginPath()
  ctx.moveTo(0, m) // start in the middle of the left side
  ctx.lineTo(x[0], m + 1) // straight line to the start of the first peak

  ctx.bezierCurveTo(x[1], m + 1, x[2], y[0], x[3], y[0]) // curve to 1st value
  ctx.bezierCurveTo(x[4], y[0], x[4], y[1], x[5], y[1]) // 2nd value
  ctx.bezierCurveTo(x[6], y[1], x[6], y[2], x[7], y[2]) // 3rd value
  ctx.bezierCurveTo(x[8], y[2], x[8], y[3], x[9], y[3]) // 4th value
  ctx.bezierCurveTo(x[10], y[3], x[10], y[4], x[11], y[4]) // 5th value

  ctx.bezierCurveTo(x[12], y[4], x[12], m, x[13], m) // curve back down to the middle

  ctx.lineTo(WIDTH, m + 1) // straight line to the right edge
  ctx.lineTo(x[13], m - 1) // and back to the end of the last peak

  // now the same in reverse for the lower half of out shape

  ctx.bezierCurveTo(x[12], m, x[12], h - y[4], x[11], h - y[4])
  ctx.bezierCurveTo(x[10], h - y[4], x[10], h - y[3], x[9], h - y[3])
  ctx.bezierCurveTo(x[8], h - y[3], x[8], h - y[2], x[7], h - y[2])
  ctx.bezierCurveTo(x[6], h - y[2], x[6], h - y[1], x[5], h - y[1])
  ctx.bezierCurveTo(x[4], h - y[1], x[4], h - y[0], x[3], h - y[0])
  ctx.bezierCurveTo(x[2], h - y[0], x[1], m, x[0], m)

  ctx.lineTo(0, m) // close the path by going back to the start

  ctx.fill()
  ctx.stroke()
 }

 /**
  * requestAnimationFrame handler that drives the visualization
  */
 const visualize = () => {
  const canvas = canvasRef.current
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const animate = () => {
   // set analyser props in the loop react on dat.gui changes
   if (analyserRef.current && freqsRef.current) {
    analyserRef.current.smoothingTimeConstant = opts.smoothing
    analyserRef.current.fftSize = Math.pow(2, opts.fft)
    analyserRef.current.minDecibels = opts.minDecibels
    analyserRef.current.maxDecibels = 0
    const freqData = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(freqData)
    freqsRef.current = freqData
   } else {
    // Generate test data for visualization
    if (!freqsRef.current) {
     freqsRef.current = new Uint8Array(256)
    }
    for (let i = 0; i < freqsRef.current.length; i++) {
     freqsRef.current[i] = Math.sin(Date.now() * 0.001 + i * 0.1) * 50 + 50
    }
   }

   // set size to clear the canvas on each frame
   canvas.width = WIDTH
   canvas.height = HEIGHT

   // draw three curves (R/G/B)
   path(ctx, 0)
   path(ctx, 1)
   path(ctx, 2)

   // schedule next paint
   animationIdRef.current = requestAnimationFrame(animate)
  }

  animate()
 }

 const handlePlay = async () => {
  if (!audioElement) {
   console.log("[Siri] No audio element provided")
   return
  }

  try {
   console.log("[Siri] Starting visualization with audio element:", audioElement.src)
   initAudioContext()

   if (audioContextRef.current?.state === "suspended") {
    await audioContextRef.current.resume()
   }
  } catch (error) {
   console.error("[Siri] Error initializing visualizer:", error)
  }
 }

 const handlePause = () => {
  if (animationIdRef.current) {
   cancelAnimationFrame(animationIdRef.current)
  }
 }

 // Start visualization on mount
 useEffect(() => {
  console.log("[Siri] Component mounted, starting visualization")
  visualize()

  return () => {
   if (animationIdRef.current) {
    cancelAnimationFrame(animationIdRef.current)
   }
  }
 }, [])

 return (
  <div className="relative w-full h-full">
   <canvas
    ref={canvasRef}
    width={WIDTH}
    height={HEIGHT}
    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-[400px]"
    style={{
     background: "green"
    }}
   />
  </div>
 )
}
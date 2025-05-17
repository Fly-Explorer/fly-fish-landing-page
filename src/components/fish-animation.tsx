"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function FishAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Fish class
    class Fish {
      x: number
      y: number
      size: number
      speed: number
      color: string
      oscillationSpeed: number
      oscillationAmplitude: number
      baseY: number
      angle: number
      canvas: HTMLCanvasElement

      constructor(x: number, y: number, size: number, speed: number, color: string, canvas: HTMLCanvasElement) {
        this.x = x
        this.y = y
        this.baseY = y
        this.size = size
        this.speed = speed
        this.color = color
        this.oscillationSpeed = 0.02 + Math.random() * 0.03
        this.oscillationAmplitude = 20 + Math.random() * 30
        this.angle = 0
        this.canvas = canvas
      }

      update() {
        this.x += this.speed
        this.angle += this.oscillationSpeed
        this.y = this.baseY + Math.sin(this.angle) * this.oscillationAmplitude

        // Reset position when fish goes off screen
        if (this.x > this.canvas.width + this.size * 2) {
          this.x = -this.size * 2
          this.baseY = Math.random() * this.canvas.height
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.translate(this.x, this.y)

        // Fish body
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(this.size / 2, -this.size / 3, this.size, -this.size / 4, this.size, 0)
        ctx.bezierCurveTo(this.size, this.size / 4, this.size / 2, this.size / 3, 0, 0)
        ctx.fill()

        // Tail
        ctx.beginPath()
        ctx.moveTo(-this.size / 4, 0)
        ctx.lineTo(-this.size / 2, -this.size / 3)
        ctx.lineTo(-this.size / 2, this.size / 3)
        ctx.closePath()
        ctx.fillStyle = this.color
        ctx.fill()

        // Eye
        ctx.beginPath()
        ctx.arc(this.size / 1.5, -this.size / 8, this.size / 10, 0, Math.PI * 2)
        ctx.fillStyle = theme === "dark" ? "#fff" : "#000"
        ctx.fill()

        ctx.restore()
      }
    }

    // Create fish
    const fishes: Fish[] = []
    const fishCount = Math.min(10, Math.floor(window.innerWidth / 200))

    const primaryColor = theme === "dark" ? "rgba(59, 130, 246, 0.6)" : "rgba(59, 130, 246, 0.4)"
    const secondaryColor = theme === "dark" ? "rgba(234, 179, 8, 0.6)" : "rgba(234, 179, 8, 0.4)"

    for (let i = 0; i < fishCount; i++) {
      const size = 20 + Math.random() * 30
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const speed = 0.5 + Math.random() * 1.5
      const color = Math.random() > 0.5 ? primaryColor : secondaryColor

      fishes.push(new Fish(x, y, size, speed, color, canvas))
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw fish
      fishes.forEach((fish) => {
        fish.update()
        fish.draw(ctx)
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-30" />
}

"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Zap, Search, Code, Shield, Sparkles, Laptop } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
}

function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("opacity-100", "translate-y-0")
            }, delay)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [delay])

  return (
    <div
      ref={cardRef}
      className={cn(
        "bg-background/50 backdrop-blur-sm",
        "border border-border rounded-lg p-6",
        "transform opacity-0 translate-y-8",
        "transition-all duration-700 ease-out",
        "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
        "ninja-slash",
      )}
    >
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-foreground/70 font-poppins">{description}</p>
    </div>
  )
}

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100")
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section id="features" className="py-20 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
      </div>

      <div ref={sectionRef} className="container mx-auto px-4 opacity-0 transition-opacity duration-1000">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block ninja-slash-reverse px-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto font-poppins">
            Fly Fish SDK provides a comprehensive set of tools for interacting with the Sui Network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Search className="h-6 w-6 text-primary" />}
            title="Lightning Fast Search"
            description="Access all Sui Network features with a simple keystroke, just like Spotlight on macOS."
            delay={100}
          />

          <FeatureCard
            icon={<Zap className="h-6 w-6 text-primary" />}
            title="Instant Transactions"
            description="Build and execute transactions on Sui Network with minimal latency and maximum efficiency."
            delay={200}
          />

          <FeatureCard
            icon={<Code className="h-6 w-6 text-primary" />}
            title="Developer Friendly"
            description="Intuitive API design with comprehensive documentation and examples for rapid development."
            delay={300}
          />

          <FeatureCard
            icon={<Shield className="h-6 w-6 text-primary" />}
            title="Secure by Design"
            description="Built with security best practices to protect your assets and transactions on Sui Network."
            delay={400}
          />

          <FeatureCard
            icon={<Sparkles className="h-6 w-6 text-primary" />}
            title="Customizable UI"
            description="Easily integrate and customize the Spotlight-like interface to match your application's design."
            delay={500}
          />

          <FeatureCard
            icon={<Laptop className="h-6 w-6 text-primary" />}
            title="Cross-Platform"
            description="Works seamlessly across all major platforms with consistent keyboard shortcuts and behavior."
            delay={600}
          />
        </div>
      </div>
    </section>
  )
}

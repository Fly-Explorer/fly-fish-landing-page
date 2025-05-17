"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function UsageSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

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

  const installCode = `npm install @flyfish/sdk`

  const usageCode = `import { FlyFish } from '@flyfish/sdk';

// Initialize the SDK
const flyfish = new FlyFish({
  network: 'mainnet',
  walletAdapter: 'auto'
});

// Register keyboard shortcut
flyfish.registerShortcut('cmd+/', () => {
  flyfish.openSpotlight();
});

// Add custom commands
flyfish.addCommand({
  name: 'Send SUI',
  description: 'Send SUI to an address',
  handler: async (args) => {
    // Implementation
  }
});`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="usage" className="py-20 relative">
      <div ref={sectionRef} className="container mx-auto px-4 opacity-0 transition-opacity duration-1000">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block ninja-slash px-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Easy Integration
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto font-poppins">
            Get started with Fly Fish SDK in minutes with our simple API.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold">Installation</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(installCode)}
                className="text-primary hover:text-primary/80"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className={cn("bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto", "border border-border")}>
              <pre>{installCode}</pre>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold">Basic Usage</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(usageCode)}
                className="text-primary hover:text-primary/80"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className={cn("bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto", "border border-border")}>
              <pre className="whitespace-pre-wrap">{usageCode}</pre>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-foreground/70 mb-6 font-poppins">
              Check out our comprehensive documentation for more examples and advanced usage.
            </p>
            <Button size="lg" className="ninja-slash">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Github, Menu, X } from "lucide-react";
import Link from "next/link"
import { cn } from "@/lib/utils"
import { GradientLogoText } from "./ui/GradientText"
import { Logo } from "./ui/logo";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "header-section fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-md py-2 shadow-md" : "bg-transparent py-4",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center group gap-5">
         <Logo width={40} height={40} />
         <GradientLogoText>Fly Fish</GradientLogoText>
        </Link>


        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-foreground/80 hover:text-primary transition-colors font-poppins">
            Features
          </Link>
          <Link href="#demo" className="text-foreground/80 hover:text-primary transition-colors font-poppins">
            Demo
          </Link>
          <Link href="#usage" className="text-foreground/80 hover:text-primary transition-colors font-poppins">
            Usage
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="https://github.com/flyfish-sdk" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </Button>
            <ModeToggle />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="#features"
              className="text-foreground/80 hover:text-primary transition-colors py-2 font-poppins"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#demo"
              className="text-foreground/80 hover:text-primary transition-colors py-2 font-poppins"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Demo
            </Link>
            <Link
              href="#usage"
              className="text-foreground/80 hover:text-primary transition-colors py-2 font-poppins"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Usage
            </Link>
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link href="https://github.com/flyfish-sdk" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

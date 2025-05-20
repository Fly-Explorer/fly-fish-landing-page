"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Command } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { GradientLogoText } from "./ui/GradientText";
import { Logo } from "./ui/logo";

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const opacity = Math.max(1 - scrollY / 500, 0.2);
      const translateY = scrollY * 0.5;

      heroRef.current.style.opacity = opacity.toString();
      heroRef.current.style.transform = `translateY(${translateY}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="hero-section relative pt-32 pb-20 overflow-hidden min-h-screen ">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* 1. Background SVG */}
        <Image
          src="/background.svg"
          alt="background"
          fill
          className="absolute inset-0 w-full h-full object-cover z-0 mix-blend-multiply opacity-50"
          draggable={false}
        />

        {/* 2. Elipse #1 */}
        <div
          className="absolute w-2/3 aspect-square rounded-full z-30 right-0 top-0 backdrop-blur-xl"
          style={{
            transform: "translate(10%, -50%)",
            background: "#008FF5",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            mixBlendMode: "screen" as any,
            filter: "blur(500px)",
          }}
        />

        {/* 3. Elipse #2 */}
        <div
          className="absolute right-[-70%] top-[10%] z-40 w-2/3 aspect-square rounded-full backdrop-blur-xl"
          style={{
            transform: "translate(30%, -30%)",
            background: "#70B9EE",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            mixBlendMode: "soft-light" as any,
            filter: "blur(500px)",
          }}
        />

        {/* 4. Video background (nên để trên cùng các lớp phủ) */}
        <video
          className="absolute right-[100%] inset-0 w-screen opacity-40 z-100 blur-sm"
          src="/videos/background-video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      <div ref={heroRef} className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col max-w-4xl mx-auto text-center justify-center items-center gap-y-2">
          <div className="relative">
            <Logo width={70} height={70} className="z-10" />
            {/* blur shadow */}
            <Logo
              width={70}
              height={70}
              className="absolute top-0 left-0 blur-xl"
            />
          </div>
          <div className="relative">
            <GradientLogoText className="gradient-text text-3xl md:text-4xl font-bold mb-6 ninja-slash bg-clip-text text-transparent inline-block px-4 ">
              Fly Fish SDK
            </GradientLogoText>

            {/* blur shadow */}
            <GradientLogoText className="absolute top-0 left-0 gradient-text text-3xl md:text-4xl font-bold mb-6 ninja-slash bg-clip-text text-transparent inline-block px-4 blur-xl">
              Fly Fish SDK
            </GradientLogoText>
          </div>

          <p className="text-sm md:text-base mb-8 text-foreground/65 font-poppins max-w-2xl mx-auto">
            The lightning-fast search interface for Sui Network. Access
            everything with a simple keystroke.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="ninja-slash group">
              <span>Get Started</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button variant="outline" size="lg" className="ninja-slash-reverse">
              <Command className="mr-2 h-4 w-4" />
              <span>Try the Demo</span>
            </Button>
          </div>

          <div
            className={cn(
              "p-3 rounded-lg inline-flex items-center",
              "bg-muted/50 border border-border",
              "text-sm text-foreground/70 font-mono"
            )}
          >
            <Command className="h-4 w-4 mr-2 text-primary" />
            <span>
              Press{" "}
              <kbd className="px-2 py-1 bg-background rounded mx-1 font-semibold">
                Cmd
              </kbd>{" "}
              +{" "}
              <kbd className="px-2 py-1 bg-background rounded mx-1 font-semibold">
                /
              </kbd>{" "}
              to activate
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

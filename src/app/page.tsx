import { AnimationContainer } from "@/components/animations/animation-container";
import { FeaturesSection } from "@/components/features-section";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { SpotlightDemo } from "@/components/spotlight-demo";
import { UsageSection } from "@/components/usage-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <AnimationContainer className="min-h-screen">
      {/* <div className="flex flex-col items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]"> */}
        <Header />
        <HeroSection />
        <SpotlightDemo />
        <FeaturesSection />
        <UsageSection />
        <Footer />
      {/* </div> */}
    </AnimationContainer>
  );
}

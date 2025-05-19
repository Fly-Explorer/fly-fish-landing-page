import { AnimationContainer } from "@/components/animations/animation-container";
import { FeaturesSection } from "@/components/features-section";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { SpotlightDemo } from "@/components/spotlight-demo";
import { UsageSection } from "@/components/usage-section";
import { Footer } from "@/components/footer";
import AppDock from "@/feature/appdock/app-dock";

export default function Home() {
  return (
    <AnimationContainer className="min-h-screen transform-gpu">
      <div id="first-fly-fish-section"></div>
      <AppDock />
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

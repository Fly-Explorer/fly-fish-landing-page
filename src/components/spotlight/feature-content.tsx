"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { SelectedFeature } from "@/types/spotlight";

// Define a common props interface for feature components
interface FeatureComponentProps {
  query?: string;
}

// Feature component mapping
const FEATURE_COMPONENTS: Record<string, React.ComponentType<FeatureComponentProps>> = {
  "check-balances": dynamic(() => import("./features/check-balances")),
  "nfts": dynamic(() => import("./features/nfts")),
  "packages": dynamic(() => import("./features/packages")),
  "package-info": dynamic(() => import("./features/package-info")),
  // Add more feature components as they are created
};

interface FeatureContentProps {
  selectedFeature: SelectedFeature;
  searchQuery: string;
}

export function FeatureContent({ selectedFeature, searchQuery }: FeatureContentProps) {
  const featureType = selectedFeature.contentType || "";
  const FeatureComponent = FEATURE_COMPONENTS[featureType];

  if (!FeatureComponent) {
    return (
      <div className="p-6 text-center text-foreground/50">
        Feature &ldquo;{featureType}&rdquo; not found or not implemented yet
      </div>
    );
  }

  return (
    <div className="max-h-80 overflow-y-auto p-4">
      <Suspense fallback={<div className="p-6 text-center">Loading feature...</div>}>
        <FeatureComponent query={searchQuery} />
      </Suspense>
    </div>
  );
} 
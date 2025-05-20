"use client";

import React, { RefObject } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectedFeature, SpotlightResult } from "@/types/spotlight";
import { FeatureContent } from "./feature-content";

interface SpotlightResultsAreaProps {
  resultsRef: RefObject<HTMLDivElement>;
  isLoading: boolean;
  error: Error | null;
  results: SpotlightResult[];
  selectedIndex: number;
  searchQuery: string;
  onResultSelect: (result: SpotlightResult) => void;
  contentType?: string;
  selectedFeature?: SelectedFeature;
}

export function SpotlightResultsArea({
  resultsRef,
  isLoading,
  error,
  results,
  selectedIndex,
  searchQuery,
  onResultSelect,
  contentType = "commands",
  selectedFeature,
}: SpotlightResultsAreaProps) {
  // Phase 2: Show feature-specific content when a feature is selected
  if (selectedFeature && contentType !== "commands") {
    return (
      <div>
        <FeatureContent
          selectedFeature={selectedFeature}
          searchQuery={searchQuery}
        />
      </div>
    );
  }

  // Phase 1: Show commands list
  return (
    <div className="flex flex-col">
      <div className="max-h-80 overflow-y-auto" ref={resultsRef}>
        {isLoading && (
          <div className="p-6 text-center text-foreground/50">
            Loading commands...
          </div>
        )}

        {error && (
          <div className="p-6 text-center text-red-500">
            Error loading commands
          </div>
        )}

        {!isLoading && !error && results.length > 0 ? (
          <div className="p-2">
            {results.map((result, index) => (
              <div
                id={`spotlight-result-${index}`}
                key={result.id}
                className={cn(
                  "flex items-center p-3 rounded-md cursor-pointer group",
                  selectedIndex === index
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                )}
                onClick={() => onResultSelect(result)}
              >
                <div className="mr-3">{result.icon}</div>
                <div className="flex-1">
                  <div className="font-medium">{result.title}</div>
                  <div
                    className={cn(
                      "text-sm",
                      selectedIndex === index
                        ? "text-primary/70"
                        : "text-foreground/60"
                    )}
                  >
                    {result.description}
                  </div>
                </div>
                <ArrowRight
                  className={cn(
                    "h-4 w-4 transition-colors",
                    selectedIndex === index
                      ? "text-primary"
                      : "text-foreground/30 group-hover:text-primary"
                  )}
                />
              </div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="p-6 text-center text-foreground/50">
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : "No commands available"}
            </div>
          )
        )}
      </div>
      
      {/* Navigation and selection controls - fixed at bottom for command search only */}
      <div className="p-3 border-t border-border bg-muted/30 text-xs text-foreground/50 flex justify-between sticky bottom-0">
        <div>
          Press{" "}
          <kbd className="px-1.5 py-0.5 bg-background rounded mx-1">↑</kbd>
          <kbd className="px-1.5 py-0.5 bg-background rounded mx-1">↓</kbd> to
          navigate
        </div>
        <div>
          Press{" "}
          <kbd className="px-1.5 py-0.5 bg-background rounded mx-1">Enter</kbd>{" "}
          to select
        </div>
      </div>
    </div>
  );
}

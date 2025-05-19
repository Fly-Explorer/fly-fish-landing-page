"use client";

import { useState, useEffect, useRef } from "react";
import { Command, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCommands } from "@/hooks";
import { ICommandResult, IDataFormated } from "@/types/api-responses";
import { SpotlightSearchBar } from "./spotlight/search-bar";
import { SpotlightResultsArea } from "./spotlight/results-area";
import { CommandData, SelectedFeature, SpotlightResult } from "@/types/spotlight";

export function SpotlightSearch() {
  // State for the modal
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | undefined>(undefined);
  const [contentType, setContentType] = useState<string>("commands");
  const inputRef = useRef<HTMLInputElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Get data from the API
  const {
    data: commandsData,
    error: commandsError,
    isLoading: commandsLoading,
  } = useCommands();
  const [processedResults, setProcessedResults] = useState<SpotlightResult[]>(
    []
  );

  // Filter results based on search query
  const filteredResults = searchQuery
    ? processedResults.filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : processedResults;

  // Toggle the spotlight modal
  const toggleSpotlight = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      // Reset selection when opening
      setSelectedIndex(-1);
    }
  };

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [processedResults]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+/ or Ctrl+/
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        toggleSpotlight();
      }

      // Only handle navigation keys when the modal is open
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (filteredResults.length > 0) {
            let newIndex = selectedIndex;
            if (selectedIndex === -1) {
              // If no selection, select the first item
              newIndex = 0;
            } else {
              // Otherwise move to the next item
              newIndex = (selectedIndex + 1) % filteredResults.length;
            }
            scrollSelectedIntoView(newIndex);
            setSelectedIndex(newIndex);
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (filteredResults.length > 0) {
            let newIndex = selectedIndex;
            if (selectedIndex === -1) {
              // If no selection, select the last item
              newIndex = filteredResults.length - 1;
            } else if (selectedIndex === 0) {
              // If at first item, wrap to the last item
              newIndex = filteredResults.length - 1;
            } else {
              // Otherwise move to the previous item
              newIndex = selectedIndex - 1;
            }
            scrollSelectedIntoView(newIndex);
            setSelectedIndex(newIndex);
          }
          break;

        case "Enter":
          e.preventDefault();
          if (filteredResults.length > 0 && selectedIndex >= 0) {
            handleResultSelect(filteredResults[selectedIndex]);
          }
          break;

        case "Escape":
          setIsOpen(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        spotlightRef.current &&
        !spotlightRef.current.contains(e.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Scroll selected item into view
  const scrollSelectedIntoView = (index: number) => {
    // If nothing is selected, don't scroll
    if (index === -1) return;

    setTimeout(() => {
      if (!resultsRef.current) return;

      const selectedElement = document.getElementById(
        `spotlight-result-${index}`
      );
      if (!selectedElement) return;

      const container = resultsRef.current;
      const containerRect = container.getBoundingClientRect();
      const selectedRect = selectedElement.getBoundingClientRect();

      if (index === 0) {
        container.scrollTop = 0;
        return;
      }

      if (index === filteredResults.length - 1) {
        container.scrollTop = container.scrollHeight;
        return;
      }

      // Check if the element is not fully visible in the container
      if (selectedRect.bottom > containerRect.bottom) {
        // Element is below the visible area
        container.scrollTop +=
          selectedRect.bottom - containerRect.bottom + selectedRect.height;
      } else if (selectedRect.top < containerRect.top) {
        // Element is above the visible area
        container.scrollTop -=
          containerRect.top - selectedRect.top + selectedRect.height;
      }
    }, 10); // Small delay to ensure DOM updates
  };

  // Process commands data when it loads
  useEffect(() => {
    if (commandsData?.data && Array.isArray(commandsData.data)) {
      // Transform API results into the format expected by the component
      const results = commandsData.data.flatMap((command: ICommandResult) => {
        if (Array.isArray(command.data)) {
          return command.data.map((item: IDataFormated) => {
            const itemData = item.data as CommandData | undefined;
            return {
              id: item.path || item.title,
              icon: itemData?.icon ? (
                <span>{itemData.icon}</span>
              ) : (
                <Search className="h-4 w-4" />
              ),
              title: item.title,
              description: itemData?.description || "",
              path: item.path,
            };
          });
        } else if (command.data) {
          const commandData = command.data as IDataFormated;
          const nestedData = commandData.data as CommandData | undefined;
          return [
            {
              id: commandData.path || commandData.title || command.title,
              icon: nestedData?.icon ? (
                <span>{nestedData.icon}</span>
              ) : (
                <Search className="h-4 w-4" />
              ),
              title: commandData.title || command.title,
              description: nestedData?.description || "",
              path: commandData.path,
            },
          ];
        }
        return [];
      });
      setProcessedResults(results);
    }
  }, [commandsData]);

  // Handle result selection
  const handleResultSelect = (result: SpotlightResult) => {
    if (result.path) {
      console.log("Selected path:", result.path);
      // Map API paths to feature types
      if (result.path.startsWith('/balance/')) {
        setSelectedFeature({
          icon: result.icon,
          name: result.title,
          path: result.path,
          contentType: "check-balances"
        });
        setContentType("check-balances");
        setSearchQuery('');
      } else if (result.path.startsWith('/package/')) {
        setSelectedFeature({
          icon: result.icon,
          name: result.title,
          path: result.path,
          contentType: "package-info"
        });
        setContentType("package-info");
        setSearchQuery('');
      } else if (result.path.startsWith('/many/')) {
        setSelectedFeature({
          icon: result.icon,
          name: result.title,
          path: result.path,
          contentType: "packages"
        });
        setContentType("packages");
        setSearchQuery('');
      } else if (result.path.startsWith('/nft/')) {
        setSelectedFeature({
          icon: result.icon,
          name: result.title,
          path: result.path,
          contentType: "nfts"
        });
        setContentType("nfts");
        setSearchQuery('');
      } else if (result.path.startsWith('/feature/')) {
        // Legacy support for existing feature paths
        const featureType = result.path.split('/')[2];
        setSelectedFeature({
          icon: result.icon,
          name: result.title,
          path: result.path,
          contentType: featureType
        });
        setContentType(featureType);
        setSearchQuery('');
      } else {
        // Otherwise close the modal
        setIsOpen(false);
      }
    } else {
      setIsOpen(false);
    }
  };

  // Reset the search to phase 1
  const resetToPhase1 = () => {
    setSelectedFeature(undefined);
    setContentType('commands');
    setSearchQuery('');
    setSelectedIndex(-1);
  };

  return (
    <section id="demo" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 inline-block ninja-slash px-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Spotlight-like Interface
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto font-poppins">
            Access all Sui Network features with a simple keystroke, just like
            Spotlight on macOS.
          </p>
        </div>

        <div className="max-w-3xl mx-auto relative">
          <div
            className={cn(
              "glass-effect rounded-xl shadow-xl overflow-hidden",
              "border border-primary/20 dark:border-primary/10",
              "transition-all duration-300 transform",
              "flex flex-col"
            )}
          >
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-destructive/70" />
                <div className="h-3 w-3 rounded-full bg-secondary/70" />
                <div className="h-3 w-3 rounded-full bg-primary/70" />
              </div>
              <div className="text-sm text-foreground/60 font-medium">
                Fly Fish SDK
              </div>
              <div className="w-16"></div>
            </div>

            <div className="p-6">
              <Button
                onClick={toggleSpotlight}
                className="w-full justify-between py-6 text-left bg-background hover:bg-background/80"
              >
                <div className="flex items-center">
                  <Command className="h-5 w-5 mr-2 text-primary" />
                  <span>
                    Press{" "}
                    <kbd className="px-2 py-1 bg-muted rounded mx-1 text-xs">
                      Cmd
                    </kbd>{" "}
                    +{" "}
                    <kbd className="px-2 py-1 bg-muted rounded mx-1 text-xs">
                      /
                    </kbd>{" "}
                    to search
                  </span>
                </div>
                <Search className="h-5 w-5 text-foreground/50" />
              </Button>
            </div>
          </div>

          {/* Spotlight Modal */}
          {isOpen && (
            <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4">
              <div
                ref={spotlightRef}
                className="w-full max-w-2xl bg-background border border-border rounded-lg shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Search Bar Component */}
                <SpotlightSearchBar 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  inputRef={inputRef as React.RefObject<HTMLInputElement>}
                  selectedFeature={selectedFeature}
                  onBack={resetToPhase1}
                />

                {/* Results Area Component */}
                <SpotlightResultsArea
                  resultsRef={resultsRef as React.RefObject<HTMLDivElement>}
                  isLoading={commandsLoading}
                  error={commandsError ? new Error("Failed to load commands") : null}
                  results={filteredResults}
                  selectedIndex={selectedIndex}
                  searchQuery={searchQuery}
                  onResultSelect={handleResultSelect}
                  contentType={contentType}
                  selectedFeature={selectedFeature}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

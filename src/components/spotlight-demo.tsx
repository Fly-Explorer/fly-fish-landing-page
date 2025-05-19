"use client";

import { SpotlightModal } from "@/feature/spotlight/SpotlightModal";
import { useState, useEffect, useRef } from "react";
import {
  Command,
  Search,
  Zap,
  Settings,
  FileText,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SpotlightDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const toggleSpotlight = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+/ or Ctrl+/
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        toggleSpotlight();
      }

      // Close on escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

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

  const results = [
    {
      id: 1,
      title: "Sui Wallet Integration",
      description: "Connect to Sui wallets",
      icon: <img src="/icons/sui.jpg" className="h-5 w-5 text-primary" />,
    },
    {
      id: 2,
      title: "Transaction Builder",
      description: "Create and sign transactions",
      icon: <Code className="h-5 w-5 text-secondary" />,
    },
    {
      id: 3,
      title: "Network Settings",
      description: "Configure network endpoints",
      icon: <Settings className="h-5 w-5 text-primary" />,
    },
    {
      id: 4,
      title: "Documentation",
      description: "View SDK documentation",
      icon: <FileText className="h-5 w-5 text-secondary" />,
    },

    {
      id: 5,
      title: "Documentation",
      description: "View SDK documentation",
      icon: <FileText className="h-5 w-5 text-secondary" />,
    },
    {
      id: 6,
      title: "Documentation",
      description: "View SDK documentation",
      icon: <FileText className="h-5 w-5 text-secondary" />,
    },
    {
      id: 7,
      title: "Documentation",
      description: "View SDK documentation",
      icon: <FileText className="h-5 w-5 text-secondary" />,
    },
    {
      id: 8,
      title: "Documentation",
      description: "View SDK documentation",
      icon: <FileText className="h-5 w-5 text-secondary" />,
    },
  ];

  const filteredResults = searchQuery
    ? results.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : results;

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
          <SpotlightModal
            isOpen={isOpen}
            spotlightRef={spotlightRef}
            inputRef={inputRef}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredResults={filteredResults}
          />

          {/* Spotlight Modal
          {isOpen && (
            <div className="fixed inset-0 bg-background/80 z-900 flex items-center justify-center p-4">
              <div
                ref={spotlightRef}
                className="w-full max-w-2xl bg-background border border-border rounded-lg shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 flex items-center border-b border-border">
                  <Search className="h-5 w-5 text-foreground/50 mr-2" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search Fly Fish SDK..."
                    className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-foreground/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="text-foreground/50 hover:text-foreground">
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {filteredResults.length > 0 ? (
                    <div className="p-2">
                      {filteredResults.map((result) => (
                        <div
                          key={result.id}
                          className="flex items-center p-3 rounded-md hover:bg-muted cursor-pointer group"
                        >
                          <div className="mr-3">{result.icon}</div>
                          <div className="flex-1">
                            <div className="font-medium">{result.title}</div>
                            <div className="text-sm text-foreground/60">{result.description}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-foreground/30 group-hover:text-primary transition-colors" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-foreground/50">No results found for "{searchQuery}"</div>
                  )}
                </div>

                <div className="p-3 border-t border-border bg-muted/30 text-xs text-foreground/50 flex justify-between">
                  <div>
                    Press <kbd className="px-1.5 py-0.5 bg-background rounded mx-1">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-background rounded mx-1">↓</kbd> to navigate
                  </div>
                  <div>
                    Press <kbd className="px-1.5 py-0.5 bg-background rounded mx-1">Enter</kbd> to select
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </section>
  );
}

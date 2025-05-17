import React, { RefObject } from "react";
import { Search, X, ArrowRight } from "lucide-react";

interface SpotlightResult {
  id: string | number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface SpotlightModalProps {
  isOpen: boolean;
  spotlightRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filteredResults: SpotlightResult[];
}

export const SpotlightModal: React.FC<SpotlightModalProps> = ({
  isOpen,
  spotlightRef,
  inputRef,
  searchQuery,
  setSearchQuery,
  filteredResults,
}) => {
  if (!isOpen) return null;
  return (
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
  );
}; 
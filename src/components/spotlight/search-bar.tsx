"use client";

import React, { RefObject } from "react";
import { Search, X, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface SpotlightSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  inputRef: RefObject<HTMLInputElement>;
  selectedFeature?: {
    icon: React.ReactNode;
    name: string;
  };
  onBack?: () => void;
}

export function SpotlightSearchBar({
  searchQuery,
  setSearchQuery,
  inputRef,
  selectedFeature,
  onBack,
}: SpotlightSearchBarProps) {
  return (
    <div className="p-4 flex items-center border-b border-border">
      {selectedFeature ? (
        <>
          {onBack && (
            <button 
              onClick={onBack}
              className="mr-2 p-1 rounded-full hover:bg-muted text-foreground/60 hover:text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <Badge className="flex items-center gap-1 mr-2 py-1.5 px-3" variant="secondary">
            {selectedFeature.icon}
            <span>{selectedFeature.name}</span>
          </Badge>
          <Separator orientation="vertical" className="h-6 mx-2" />
        </>
      ) : (
        <Search className="h-5 w-5 text-foreground/50 mr-2" />
      )}
      
      <input
        ref={inputRef}
        type="text"
        placeholder={selectedFeature 
          ? `Search in ${selectedFeature.name}...` 
          : "Search Fly Fish SDK..."}
        className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-foreground/50"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="text-foreground/50 hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
} 
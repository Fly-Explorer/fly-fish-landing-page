import React, { RefObject, useEffect, useState } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { useCommands } from "@/hooks";
import { ICommandResult, IDataFormated } from "@/types/api-responses";

// Extended interface to include icon and description fields that might be in the data
interface CommandData {
  icon?: string;
  description?: string;
  [key: string]: unknown;
}

interface SpotlightResult {
  id: string | number;
  icon: React.ReactNode;
  title: string;
  description: string;
  path?: string;
}

interface SpotlightModalProps {
  isOpen: boolean;
  spotlightRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  filteredResults: SpotlightResult[];
  onResultSelect?: (path: string) => void;
}

export const SpotlightModal: React.FC<SpotlightModalProps> = ({
  isOpen,
  spotlightRef,
  inputRef,
  searchQuery,
  setSearchQuery,
  filteredResults: propResults,
  onResultSelect,
}) => {
  const { data: commandsData, error: commandsError, isLoading: commandsLoading } = useCommands();
  const [processedResults, setProcessedResults] = useState<SpotlightResult[]>([]);

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
              icon: itemData?.icon ? <span>{itemData.icon}</span> : <Search className="h-4 w-4" />,
              title: item.title,
              description: itemData?.description || '',
              path: item.path
            };
          });
        } else if (command.data) {
          const commandData = command.data as IDataFormated;
          const nestedData = commandData.data as CommandData | undefined;
          return [{
            id: commandData.path || commandData.title || command.title,
            icon: nestedData?.icon ? <span>{nestedData.icon}</span> : <Search className="h-4 w-4" />,
            title: commandData.title || command.title,
            description: nestedData?.description || '',
            path: commandData.path
          }];
        }
        return [];
      });
      setProcessedResults(results);
    }
  }, [commandsData]);

  // Filter results based on search query
  const filteredResults = searchQuery 
    ? processedResults.filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        result.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : processedResults;

  // Handle result selection
  const handleResultSelect = (result: SpotlightResult) => {
    if (result.path && onResultSelect) {
      onResultSelect(result.path);
    }
  };

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
          {commandsLoading && (
            <div className="p-6 text-center text-foreground/50">Loading commands...</div>
          )}
          
          {commandsError && (
            <div className="p-6 text-center text-red-500">Error loading commands</div>
          )}
          
          {!commandsLoading && !commandsError && filteredResults.length > 0 ? (
            <div className="p-2">
              {filteredResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center p-3 rounded-md hover:bg-muted cursor-pointer group"
                  onClick={() => handleResultSelect(result)}
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
          ) : !commandsLoading && (
            <div className="p-6 text-center text-foreground/50">
              {searchQuery ? `No results found for "${searchQuery}"` : "No commands available"}
            </div>
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
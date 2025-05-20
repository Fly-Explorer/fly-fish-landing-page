import React, { useState, useEffect } from 'react';
import { Package, ExternalLink, Loader2, Copy, FileCode, Library, Code, Database, FunctionSquare } from 'lucide-react';
import { usePackageInfo } from '@/hooks/useSuiApi';

interface PackageInfoProps {
  query?: string;
}

interface ModuleInfo {
  name: string;
  functions: number;
  structs: number;
}

const PackageInfo: React.FC<PackageInfoProps> = ({ query }) => {
  const [packageId, setPackageId] = useState<string>(query || '');
  const [searchPackageId, setSearchPackageId] = useState<string>('');
  
  // Get package data using the hook
  const { data, error, isLoading } = usePackageInfo(searchPackageId);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [modules, setModules] = useState<ModuleInfo[]>([]);
  
  // Process the data when it arrives
  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      try {
        const moduleList: ModuleInfo[] = [];
        
        data.data.forEach(item => {
          if (item.data && Array.isArray(item.data)) {
            item.data.forEach(module => {
              const moduleData = module.data as Record<string, unknown>;
              if (moduleData && module.title) {
                moduleList.push({
                  name: module.title,
                  functions: Array.isArray(moduleData.functions) ? moduleData.functions.length : 0,
                  structs: Array.isArray(moduleData.structs) ? moduleData.structs.length : 0
                });
              }
            });
          }
        });
        
        setModules(moduleList.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error('Error processing package data:', err);
      }
    }
  }, [data]);

  const handleViewPackage = () => {
    if (!packageId.trim()) return;
    setSearchPackageId(packageId);
    setHasSearched(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const truncatePackageId = (id: string) => {
    if (!id || id.length < 10) return id;
    return `${id.substring(0, 8)}...${id.substring(id.length - 6)}`;
  };

  const getModuleColor = (index: number) => {
    const colors = [
      'bg-blue-50 border-blue-200 text-blue-700',
      'bg-green-50 border-green-200 text-green-700',
      'bg-purple-50 border-purple-200 text-purple-700',
      'bg-amber-50 border-amber-200 text-amber-700',
      'bg-pink-50 border-pink-200 text-pink-700',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <span>Package Information</span>
        </h3>
        {hasSearched && searchPackageId && (
          <a 
            href={`https://explorer.sui.io/object/${searchPackageId}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs flex items-center gap-1 text-primary hover:underline"
          >
            View in Explorer
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
      
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex gap-2">
          <input 
            type="text" 
            className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none bg-background"
            value={packageId}
            onChange={(e) => setPackageId(e.target.value)}
            placeholder="Enter Sui package ID..."
            onKeyDown={(e) => e.key === 'Enter' && handleViewPackage()}
          />
          <button 
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              isLoading 
                ? 'bg-primary/70 text-black cursor-not-allowed' 
                : 'bg-primary text-black hover:bg-primary/90'
            }`}
            onClick={handleViewPackage}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading
              </span>
            ) : 'View Package'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            Error loading package data. Please check the package ID and try again.
          </div>
        )}
        
        {searchPackageId && hasSearched && !error && (
          <div className="mt-4 animate-fadeIn">
            <div className="flex items-center gap-2 mb-4 bg-muted/40 p-2 rounded-md">
              <div className="bg-primary/10 rounded-full p-1.5">
                <Database className="h-4 w-4 text-primary" />
              </div>
              <div className="text-sm font-medium truncate flex-1">
                {truncatePackageId(searchPackageId)}
              </div>
              <button 
                onClick={() => copyToClipboard(searchPackageId)}
                className="text-foreground/60 hover:text-primary p-1 rounded-md hover:bg-muted transition-colors"
                title="Copy package ID"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            
            {isLoading ? (
              <div className="py-12 flex flex-col justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-sm text-foreground/70">Loading package information...</p>
              </div>
            ) : (
              <>
                {modules.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
                      <Library className="h-5 w-5 text-primary" />
                      <div className="font-medium">
                        {modules.length} Module{modules.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <div className="grid gap-2 mt-3">
                      {modules.map((module, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-md border transition-all hover:shadow-sm ${getModuleColor(index)}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Code className="h-4 w-4" />
                              <div className="font-mono font-medium text-sm">{module.name}</div>
                            </div>
                          </div>
                          <div className="flex justify-between mt-2 text-xs">
                            <div className="flex items-center gap-1">
                              <FunctionSquare className="h-3.5 w-3.5" />
                              <span>{module.functions} function{module.functions !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileCode className="h-3.5 w-3.5" />
                              <span>{module.structs} struct{module.structs !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center flex flex-col items-center text-foreground/60 bg-muted/20 rounded-lg">
                    <Library className="h-10 w-10 mb-2 text-foreground/30" />
                    <p>No modules found in this package</p>
                    <p className="text-xs mt-1">This package ID may be invalid or have no modules</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
        <p>Enter a package ID to view its modules, functions, and other details.</p>
      </div>
    </div>
  );
};

export default PackageInfo; 
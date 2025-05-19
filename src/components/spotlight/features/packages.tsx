import React, { useState, useEffect } from 'react';
import { Package, ExternalLink, Loader2, Copy, ArrowUpRight, Archive, Code } from 'lucide-react';
import { usePackagesByAddress } from '@/hooks/useSuiApi';

interface PackagesProps {
  query?: string;
}

interface PackageInfo {
  id: string;
  name: string;
  moduleCount: number;
}

const Packages: React.FC<PackagesProps> = ({ query }) => {
  const [address, setAddress] = useState<string>(query || '');
  const [searchAddress, setSearchAddress] = useState<string>('');
  
  // Get packages data using the hook
  const { data, error, isLoading } = usePackagesByAddress(searchAddress);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  
  // Process the data when it arrives
  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      try {
        const packagesList: PackageInfo[] = [];
        
        data.data.forEach(item => {
          if (item.data && Array.isArray(item.data)) {
            item.data.forEach(pkg => {
              const packageData = pkg.data as Record<string, unknown>;
              if (packageData && pkg.title) {
                packagesList.push({
                  id: pkg.path || '',
                  name: pkg.title,
                  moduleCount: Array.isArray(packageData.modules) ? packageData.modules.length : 0
                });
              }
            });
          }
        });
        
        setPackages(packagesList.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error('Error processing packages data:', err);
      }
    }
  }, [data]);

  const handleViewPackages = () => {
    if (!address.trim()) return;
    setSearchAddress(address);
    setHasSearched(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const truncateId = (id: string) => {
    if (!id || id.length < 10) return id;
    return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
  };

  // Randomly assign a color to each package for visual variety
  const getPackageColor = (index: number) => {
    const colors = [
      'border-blue-200',
      'border-green-200',
      'border-purple-200',
      'border-amber-200',
      'border-teal-200',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Archive className="h-5 w-5 text-primary" />
          <span>Browse Packages</span>
        </h3>
        {hasSearched && searchAddress && (
          <a 
            href={`https://explorer.sui.io/address/${searchAddress}`} 
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
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Sui wallet address..."
            onKeyDown={(e) => e.key === 'Enter' && handleViewPackages()}
          />
          <button 
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              isLoading 
                ? 'bg-primary/70 text-black cursor-not-allowed' 
                : 'bg-primary text-black hover:bg-primary/90'
            }`}
            onClick={handleViewPackages}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading
              </span>
            ) : 'View Packages'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            Error loading packages. Please check the address and try again.
          </div>
        )}
        
        {searchAddress && hasSearched && !error && (
          <div className="mt-4 animate-fadeIn">
            <div className="flex items-center gap-2 mb-4 bg-muted/40 p-2 rounded-md">
              <div className="bg-primary/10 rounded-full p-1.5">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div className="text-sm font-medium truncate flex-1">
                Address: {truncateId(searchAddress)}
              </div>
              <button 
                onClick={() => copyToClipboard(searchAddress)}
                className="text-foreground/60 hover:text-primary p-1 rounded-md hover:bg-muted transition-colors"
                title="Copy address"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            
            {isLoading ? (
              <div className="py-12 flex flex-col justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-sm text-foreground/70">Loading packages...</p>
              </div>
            ) : (
              <>
                {packages.length > 0 ? (
                  <>
                    <div className="bg-muted/30 p-2 rounded-md mb-3 flex justify-between items-center">
                      <div className="text-sm font-medium flex items-center gap-1">
                        <Archive className="h-4 w-4 text-primary" />
                        <span>{packages.length} Package{packages.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="text-xs text-foreground/60">Published by this address</div>
                    </div>
                    
                    <div className="grid gap-3 sm:grid-cols-2">
                      {packages.map((pkg, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-md border bg-background/80 hover:shadow-md transition-all ${getPackageColor(index)}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-primary/10 rounded-full">
                              <Package className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div className="font-medium truncate">{pkg.name}</div>
                          </div>
                          
                          <div className="flex items-center gap-1 mb-3 text-xs text-foreground/60">
                            <Code className="h-3.5 w-3.5" />
                            <span>{pkg.moduleCount} Module{pkg.moduleCount !== 1 ? 's' : ''}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
                            <div className="text-foreground/60 truncate max-w-[160px]" title={pkg.id}>
                              {truncateId(pkg.id)}
                            </div>
                            <a
                              href={`https://explorer.sui.io/object/${pkg.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              View
                              <ArrowUpRight className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center flex flex-col items-center text-foreground/60 bg-muted/20 rounded-lg">
                    <Archive className="h-10 w-10 mb-2 text-foreground/30" />
                    <p>No packages found for this address</p>
                    <p className="text-xs mt-1">This address may not have published any packages</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
        <p>Enter a wallet address to view all packages published by that address.</p>
      </div>
    </div>
  );
};

export default Packages; 
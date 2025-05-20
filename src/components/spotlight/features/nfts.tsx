import React, { useState, useEffect } from 'react';
import { Image, ExternalLink, Loader2, Copy, ArrowUpRight, Images, InfoIcon } from 'lucide-react';
import { useNFTs } from '@/hooks/useSuiApi';

interface NFTsProps {
  query?: string;
}

interface NFTInfo {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  collection?: string;
}

const NFTs: React.FC<NFTsProps> = ({ query }) => {
  const [address, setAddress] = useState<string>(query || '');
  const [searchAddress, setSearchAddress] = useState<string>('');
  
  // Get NFTs data using the hook
  const { data, error, isLoading } = useNFTs(searchAddress);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [nfts, setNfts] = useState<NFTInfo[]>([]);
  
  // Process the data when it arrives
  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      try {
        const nftsList: NFTInfo[] = [];
        
        data.data.forEach(item => {
          if (item.data && Array.isArray(item.data)) {
            item.data.forEach(nft => {
              const nftData = nft.data as Record<string, unknown>;
              if (nftData && nft.title) {
                nftsList.push({
                  id: nft.path || '',
                  name: nft.title,
                  description: typeof nftData.description === 'string' ? nftData.description : '',
                  imageUrl: typeof nftData.imageUrl === 'string' ? nftData.imageUrl : undefined,
                  collection: typeof nftData.collection === 'string' ? nftData.collection : undefined
                });
              }
            });
          }
        });
        
        setNfts(nftsList);
      } catch (err) {
        console.error('Error processing NFTs data:', err);
      }
    }
  }, [data]);

  const handleViewNFTs = () => {
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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Images className="h-5 w-5 text-primary" />
          <span>Browse NFTs</span>
        </h3>
        {hasSearched && searchAddress && (
          <a 
            href={`https://explorer.sui.io/address/${searchAddress}?tab=nfts`} 
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
            onKeyDown={(e) => e.key === 'Enter' && handleViewNFTs()}
          />
          <button 
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              isLoading 
                ? 'bg-primary/70 text-black cursor-not-allowed' 
                : 'bg-primary text-black hover:bg-primary/90'
            }`}
            onClick={handleViewNFTs}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading
              </span>
            ) : 'View NFTs'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            Error loading NFTs. Please check the address and try again.
          </div>
        )}
        
        {searchAddress && hasSearched && !error && (
          <div className="mt-4 animate-fadeIn">
            <div className="flex items-center gap-2 mb-4 bg-muted/40 p-2 rounded-md">
              <div className="bg-primary/10 rounded-full p-1.5">
                <Image className="h-4 w-4 text-primary" />
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
                <p className="text-sm text-foreground/70">Loading NFTs...</p>
              </div>
            ) : (
              <>
                {nfts.length > 0 ? (
                  <>
                    <div className="bg-muted/30 p-2 rounded-md mb-3 flex justify-between items-center">
                      <div className="text-sm font-medium flex items-center gap-1">
                        <Images className="h-4 w-4 text-primary" />
                        <span>{nfts.length} NFT{nfts.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="text-xs text-foreground/60">Owned by this address</div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {nfts.map((nft, index) => (
                        <div key={index} className="border rounded-md overflow-hidden bg-background/50 hover:shadow-md transition-all group">
                          <div className="aspect-square bg-muted/30 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                            {nft.imageUrl ? (
                              <img 
                                src={nft.imageUrl} 
                                alt={nft.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOTk5Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Image className="h-12 w-12 text-foreground/30" />
                              </div>
                            )}
                            {nft.description && (
                              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                                <div className="text-white text-xs overflow-y-auto max-h-full text-center">
                                  {nft.description}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="font-medium text-sm truncate">{nft.name}</div>
                            {nft.collection && (
                              <div className="text-xs text-foreground/60 truncate flex items-center gap-1">
                                <InfoIcon className="h-3 w-3" />
                                {nft.collection}
                              </div>
                            )}
                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/50 text-xs">
                              <div className="text-foreground/50 truncate max-w-[80px]" title={nft.id}>
                                {truncateId(nft.id)}
                              </div>
                              <a
                                href={`https://explorer.sui.io/object/${nft.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                View
                                <ArrowUpRight className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center flex flex-col items-center text-foreground/60 bg-muted/20 rounded-lg">
                    <Images className="h-10 w-10 mb-2 text-foreground/30" />
                    <p>No NFTs found for this address</p>
                    <p className="text-xs mt-1">This address may not own any NFTs or may not exist</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
        <p>Enter a wallet address to view all NFTs owned by that address.</p>
      </div>
    </div>
  );
};

export default NFTs; 
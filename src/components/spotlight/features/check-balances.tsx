import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, Wallet, Loader2, DollarSign, Coins } from 'lucide-react';
import { useBalances } from '@/hooks/useSuiApi';

interface CheckBalancesProps {
  query?: string;
}

interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  icon?: React.ReactNode;
}

interface TokenData {
  symbol?: string;
  name?: string;
  balance?: string;
  value?: string;
  icon?: string;
}

const CheckBalances: React.FC<CheckBalancesProps> = ({ query }) => {
  const [address, setAddress] = useState<string>(query || '');
  const [searchAddress, setSearchAddress] = useState<string>('');
  
  // Get real balance data using the hook
  const { data, error, isLoading: isLoadingData } = useBalances(searchAddress);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [totalValue, setTotalValue] = useState<string>('$0.00');

  // Process the data when it arrives
  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      try {
        // Parse the data and format it for display
        const tokens: TokenBalance[] = [];
        let total = 0;
        
        data.data.forEach(item => {
          if (item.data && Array.isArray(item.data)) {
            item.data.forEach(token => {
              const tokenData = token.data as TokenData;
              if (tokenData) {
                const value = parseFloat(tokenData.value || '0');
                total += value;
                
                tokens.push({
                  symbol: tokenData.symbol || 'Unknown',
                  name: tokenData.name || 'Unknown Token',
                  balance: tokenData.balance || '0',
                  value: `$${value.toFixed(2)}`,
                  icon: tokenData.symbol === 'SUI' ? '🔷' : 
                         tokenData.symbol === 'USDC' ? '💵' : '🪙'
                });
              }
            });
          }
        });
        
        setTokenBalances(tokens);
        setTotalValue(`$${total.toFixed(2)}`);
      } catch (err) {
        console.error('Error processing balance data:', err);
      }
    } else if (data && !isLoadingData) {
      // Fallback when no data or unexpected format
      setTokenBalances([
        {
          symbol: 'SUI',
          name: 'Sui',
          balance: '0',
          value: '$0.00',
          icon: '🔷'
        }
      ]);
      setTotalValue('$0.00');
    }
  }, [data, isLoadingData]);

  const handleCheckBalance = () => {
    if (!address.trim()) return;
    setSearchAddress(address);
    setHasSearched(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const truncateAddress = (addr: string) => {
    if (!addr || addr.length < 10) return addr;
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <span>Wallet Balances</span>
        </h3>
        {hasSearched && (
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
            onKeyDown={(e) => e.key === 'Enter' && handleCheckBalance()}
          />
          <button 
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              isLoadingData 
                ? 'bg-primary/70 text-black cursor-not-allowed' 
                : 'bg-primary text-black hover:bg-primary/90'
            }`}
            onClick={handleCheckBalance}
            disabled={isLoadingData}
          >
            {isLoadingData ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading
              </span>
            ) : 'Check Balance'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            Error loading balance data. Please check the address and try again.
          </div>
        )}
        
        {searchAddress && hasSearched && !error && (
          <div className="mt-4 animate-fadeIn">
            <div className="flex items-center gap-2 mb-4 bg-muted/40 p-2 rounded-md">
              <div className="bg-primary/10 rounded-full p-1.5">
                <Wallet className="h-4 w-4 text-primary" />
              </div>
              <div className="text-sm font-medium truncate flex-1">
                {truncateAddress(searchAddress)}
              </div>
              <button 
                onClick={() => copyToClipboard(searchAddress)}
                className="text-foreground/60 hover:text-primary p-1 rounded-md hover:bg-muted transition-colors"
                title="Copy address"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            
            {isLoadingData ? (
              <div className="py-12 flex flex-col justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-sm text-foreground/70">Loading balances...</p>
              </div>
            ) : (
              <>
                {tokenBalances.length > 0 ? (
                  <>
                    <div className="grid gap-3 mb-4">
                      {tokenBalances.map((token, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 rounded-md border border-border/50 hover:border-primary/30 transition-colors bg-background/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
                              {token.icon}
                            </div>
                            <div>
                              <div className="font-semibold">{token.symbol}</div>
                              <div className="text-xs text-foreground/60">{token.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{token.balance}</div>
                            <div className="text-xs text-foreground/60">{token.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex items-center justify-between bg-muted/20 p-3 rounded-md">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <span className="font-medium">Total Value:</span>
                      </div>
                      <span className="font-bold text-lg">{totalValue}</span>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center flex flex-col items-center text-foreground/60 bg-muted/20 rounded-lg">
                    <Coins className="h-10 w-10 mb-2 text-foreground/30" />
                    <p>No token balances found for this address</p>
                    <p className="text-xs mt-1">This address may not have any tokens or may not exist</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
        <p>This feature shows your SUI and other tokens on the Sui blockchain. Enter any wallet address to view its balances.</p>
      </div>
    </div>
  );
};

export default CheckBalances;

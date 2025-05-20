import BaseService from './base-service';
import { ICommandResponse } from '@/types/api-responses';
import type { SuiNetwork } from './network-service';

class SuiOverflowService extends BaseService<ICommandResponse> {
  constructor() {
    super('');
  }

  /**
   * Get the current network (always testnet)
   */
  getNetwork(): SuiNetwork {
    return 'testnet';
  }

  /**
   * Get the endpoint URL with testnet prefix
   * @param path The API path without network prefix
   * @returns Full endpoint URL
   */
  private getEndpoint(path: string): string {
    return `/testnet${path}`;
  }

  /**
   * Process options for API requests
   * @param options Request options
   * @returns Updated options
   */
  private processOptions(options: Record<string, unknown> = {}): Record<string, unknown> {
    return {
      ...options,
      headers: {
        ...(options.headers as Record<string, string> || {})
      }
    };
  }

  /**
   * Get root commands
   * @param query Optional search text
   * @returns List of available commands
   */
  async getCommands(): Promise<ICommandResponse> {
    const endpoint = this.getEndpoint('/commands');
    const options = this.processOptions();
    
    return this.apiClient.get<ICommandResponse>(endpoint, options);
  }

  /**
   * Get all coin balances for an address
   * @param address Sui address
   * @returns Balance information
   */
  async getBalances(address: string): Promise<ICommandResponse> {
    const endpoint = this.getEndpoint(`/balance/${address}`);
    return this.apiClient.get<ICommandResponse>(endpoint, this.processOptions());
  }

  /**
   * Get specific token balance for an address
   * @param address Sui address
   * @param coinType Coin type identifier
   * @returns Specific coin balance
   */
  async getTokenBalance(address: string, coinType: string): Promise<ICommandResponse> {
    const endpoint = this.getEndpoint(`/balance/${address}/${coinType}`);
    return this.apiClient.get<ICommandResponse>(endpoint, this.processOptions());
  }

  /**
   * Find all packages published by an address
   * @param address Publisher's Sui address
   * @returns List of packages
   */
  async getPackagesByAddress(address: string): Promise<ICommandResponse> {
    const endpoint = this.getEndpoint(`/package/many/${address}`);
    return this.apiClient.get<ICommandResponse>(endpoint, this.processOptions());
  }

  /**
   * Get detailed information about a specific package
   * @param packageId Package ID
   * @returns Package information
   */
  async getPackageInfo(packageId: string): Promise<ICommandResponse> {
    const endpoint = this.getEndpoint(`/package/${packageId}`);
    return this.apiClient.get<ICommandResponse>(endpoint, this.processOptions());
  }

  /**
   * Get detailed information about a specific module within a package
   * @param packageId Package ID
   * @param moduleId Module name
   * @returns Module information
   */
  async getModuleInfo(packageId: string, moduleId: string): Promise<ICommandResponse> {
    const endpoint = this.getEndpoint(`/package/${packageId}/${moduleId}`);
    return this.apiClient.get<ICommandResponse>(endpoint, this.processOptions());
  }

  /**
   * Get detailed information about a specific function within a module
   * @param packageId Package ID
   * @param moduleId Module name
   * @param functionId Function name
   * @returns Function information
   */
  async getFunctionInfo(packageId: string, moduleId: string, functionId: string): Promise<ICommandResponse> {
    const endpoint = this.getEndpoint(`/package/${packageId}/${moduleId}/${functionId}`);
    return this.apiClient.get<ICommandResponse>(endpoint, this.processOptions());
  }

  /**
   * Get all NFTs owned by an address
   * @param address Sui address
   * @returns List of NFTs
   */
  async getNFTs(address: string): Promise<ICommandResponse> {
    const endpoint = this.getEndpoint(`/nft/${address}`);
    return this.apiClient.get<ICommandResponse>(endpoint, this.processOptions());
  }

  /**
   * Generic method to follow a path from the API response
   * @param path Path to follow
   * @returns Response data for the path
   */
  async followPath(path: string): Promise<ICommandResponse> {
    // If path starts with /, don't add network prefix
    const usePathAsIs = path.startsWith('/');
    const endpoint = usePathAsIs ? path : this.getEndpoint(path);
    return this.apiClient.get<ICommandResponse>(endpoint, this.processOptions());
  }
}

export const suiOverflowService = new SuiOverflowService();
export default SuiOverflowService; 
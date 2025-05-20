export type SuiNetwork = 'testnet';

class NetworkService {
  /**
   * Get the current network (always testnet)
   */
  getCurrentNetwork(): SuiNetwork {
    return 'testnet';
  }

  /**
   * Set the network (ignored, always testnet)
   */
  setNetwork(): void {
    // No-op, we only use testnet
  }

  /**
   * For API compatibility, always returns testnet
   */
  toggleNetwork(): SuiNetwork {
    return 'testnet';
  }
}

export const networkService = new NetworkService();
export default NetworkService; 
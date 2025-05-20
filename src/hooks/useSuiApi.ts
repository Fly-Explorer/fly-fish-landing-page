import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { suiOverflowService } from "@/services";
import { ICommandResponse } from "@/types/api-responses";

// Fetcher functions for SWR
const fetchers = {
  // Commands
  getCommands: async (): Promise<ICommandResponse> => {
    return suiOverflowService.getCommands();
  },

  // Balances
  getBalances: async ([, address]: string[]): Promise<ICommandResponse> => {
    return suiOverflowService.getBalances(address);
  },

  getTokenBalance: async ([
    ,
    address,
    coinType,
  ]: string[]): Promise<ICommandResponse> => {
    return suiOverflowService.getTokenBalance(address, coinType);
  },

  // Packages
  getPackagesByAddress: async ([
    ,
    address,
  ]: string[]): Promise<ICommandResponse> => {
    return suiOverflowService.getPackagesByAddress(address);
  },

  getPackageInfo: async ([
    ,
    packageId,
  ]: string[]): Promise<ICommandResponse> => {
    return suiOverflowService.getPackageInfo(packageId);
  },

  getModuleInfo: async ([
    ,
    packageId,
    moduleId,
  ]: string[]): Promise<ICommandResponse> => {
    return suiOverflowService.getModuleInfo(packageId, moduleId);
  },

  getFunctionInfo: async ([
    ,
    packageId,
    moduleId,
    functionId,
  ]: string[]): Promise<ICommandResponse> => {
    return suiOverflowService.getFunctionInfo(packageId, moduleId, functionId);
  },

  // NFTs
  getNFTs: async ([, address]: string[]): Promise<ICommandResponse> => {
    return suiOverflowService.getNFTs(address);
  },

  // Generic path follower
  followPath: async (key: string): Promise<ICommandResponse> => {
    const [, ...pathParts] = key.split("/followPath/");
    const path = pathParts.join("/");
    return suiOverflowService.followPath(path);
  },
};

// SWR Hook for commands
export function useCommands() {
  return useSWR<ICommandResponse>('commands', fetchers.getCommands);
}

// SWR Hooks for balances
export function useBalances(address: string) {
  return useSWR<ICommandResponse>(
    address ? ["balances", address] : null,
    fetchers.getBalances
  );
}

export function useTokenBalance(address: string, coinType: string) {
  return useSWR<ICommandResponse>(
    address && coinType ? ["tokenBalance", address, coinType] : null,
    fetchers.getTokenBalance
  );
}

// SWR Hooks for packages
export function usePackagesByAddress(address: string) {
  return useSWR<ICommandResponse>(
    address ? ["packagesByAddress", address] : null,
    fetchers.getPackagesByAddress
  );
}

export function usePackageInfo(packageId: string) {
  return useSWR<ICommandResponse>(
    packageId ? ["packageInfo", packageId] : null,
    fetchers.getPackageInfo
  );
}

export function useModuleInfo(packageId: string, moduleId: string) {
  return useSWR<ICommandResponse>(
    packageId && moduleId ? ["moduleInfo", packageId, moduleId] : null,
    fetchers.getModuleInfo
  );
}

export function useFunctionInfo(
  packageId: string,
  moduleId: string,
  functionId: string
) {
  return useSWR<ICommandResponse>(
    packageId && moduleId && functionId
      ? ["functionInfo", packageId, moduleId, functionId]
      : null,
    fetchers.getFunctionInfo
  );
}

// SWR Hook for NFTs
export function useNFTs(address: string) {
  return useSWR<ICommandResponse>(
    address ? ["nfts", address] : null,
    fetchers.getNFTs
  );
}

// SWR Hook for following paths
export function useFollowPath(path: string | null | undefined) {
  return useSWR<ICommandResponse>(
    path ? `/followPath/${path}` : null,
    fetchers.followPath
  );
}

// SWR Mutation Hook for dynamic paths
export function useApiMutation() {
  return useSWRMutation<ICommandResponse, Error, string>(
    "followPath",
    async (_, { arg: path }) => suiOverflowService.followPath(path)
  );
}

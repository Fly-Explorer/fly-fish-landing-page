export interface ICommandResponse {
  code: number;
  status: boolean;
  data?: ICommandResult[];
  message?: string;
}

export interface ICommandResult {
  data: IDataFormated[] | IDataFormated;
  title: string;
  path?: string;
}

export interface IDataFormated {
  title: string;
  path?: string;
  data?: unknown;
}

// Specific data types
export interface BalanceData {
  title: string;
  path: string;
}

export interface NFTData {
  objectId: string;
  version: string;
  digest: string;
  content: {
    dataType: string;
    type: string;
    hasPublicTransfer: boolean;
    fields: {
      description: string;
      id: {
        id: string;
      };
      name: string;
      url: string;
      [key: string]: unknown;
    };
  };
} 
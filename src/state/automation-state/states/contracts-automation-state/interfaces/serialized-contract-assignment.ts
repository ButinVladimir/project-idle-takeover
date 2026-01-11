import { ISerializedContract } from '@state/activity-state';

export interface ISerializedContractAssignment {
  id: string;
  contract: ISerializedContract;
  enabled: boolean;
}

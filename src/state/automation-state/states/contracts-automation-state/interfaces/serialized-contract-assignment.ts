import { ISerializedContract } from '@state/activity-state';

export interface ISerializedContractAssignment {
  id: string;
  contract: ISerializedContract;
  active: boolean;
}

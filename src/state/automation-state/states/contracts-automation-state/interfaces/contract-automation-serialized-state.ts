import { ISerializedContract } from '@state/activity-state';

export interface IContractAutomationSerializedState {
  id: string;
  contract: ISerializedContract;
  active: boolean;
}

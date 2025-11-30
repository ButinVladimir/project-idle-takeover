import { IContract } from '@state/activity-state';
import { IContractAutomationSerializedState } from './contract-automation-serialized-state';

export interface IContractAutomationState {
  id: string;
  contract: IContract;
  active: boolean;
  canBeRepeated(): boolean;
  toggleActive(active: boolean): void;
  serialize(): IContractAutomationSerializedState;
  removeAllEventListeners(): void;
}

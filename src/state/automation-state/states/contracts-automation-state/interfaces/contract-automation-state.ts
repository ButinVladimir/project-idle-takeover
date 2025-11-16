import { IContractAutomationSerializedState } from './contract-automation-serialized-state';

export interface IContractAutomationState {
  districtIndex: number;
  contractName: string;
  active: boolean;
  canBeRepeated(): boolean;
  toggleActive(active: boolean): void;
  serialize(): IContractAutomationSerializedState;
  removeAllEventListeners(): void;
}

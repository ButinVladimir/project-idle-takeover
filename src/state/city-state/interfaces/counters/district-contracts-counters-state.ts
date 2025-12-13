import { IDistrictContractsCountersSerializedState } from '../serialized-states';

export interface IDistrictContractsCountersState {
  getPassedGenerationTime(contractName: string): number;
  getRequiredGenerationTime(contractName: string): number;
  getAvailableAmount(contractName: string): number;
  getChance(contractName: string): number;
  useContract(contractName: string): boolean;
  processTick(): void;
  serialize(): IDistrictContractsCountersSerializedState;
  deserialize(serializedState: IDistrictContractsCountersSerializedState): void;
  removeAllEventListeners(): void;
}

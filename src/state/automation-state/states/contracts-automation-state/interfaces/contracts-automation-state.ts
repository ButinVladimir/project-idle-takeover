import { ISerializeable } from '@shared/index';
import { IContractsAutomationSerializedState } from './contracts-automation-serialized-state';
import { IContractAutomationState } from './contract-automation-state';

export interface IContractsAutomationState extends ISerializeable<IContractsAutomationSerializedState> {
  listContractPriorities(): IContractAutomationState[];
  addContractAutomation(contractName: string, districtIndex: number): void;
  removeContractAutonation(contractName: string, districtIndex: number): void;
  moveContractAutomation(contractName: string, districtIndex: number, position: number): void;
  toggleActiveAll(active: boolean): void;
  repeatAll(): void;
}

import { ISerializeable } from '@shared/index';
import { IContractsAutomationSerializedState } from './contracts-automation-serialized-state';
import { IContractAutomationState } from './contract-automation-state';
import { IMakeContractAutomationStateArgs } from './make-contract-automation-state-args';

export interface IContractsAutomationState extends ISerializeable<IContractsAutomationSerializedState> {
  listContractPriorities(): IContractAutomationState[];
  getContractAutomationById(id: string): IContractAutomationState | undefined;
  getContractAutomationByDistrictAndContract(
    districtIndex: number,
    contractName: string,
  ): IContractAutomationState | undefined;
  addContractAutomation(parameters: IMakeContractAutomationStateArgs): void;
  removeContractAutomation(id: string): void;
  removeAllContractAutomations(): void;
  moveContractAutomation(id: string, position: number): void;
  toggleActiveAll(active: boolean): void;
  repeatAll(): void;
}

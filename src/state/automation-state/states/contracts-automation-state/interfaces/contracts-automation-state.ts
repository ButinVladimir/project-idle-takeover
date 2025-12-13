import { ISerializeable } from '@shared/index';
import { IContractsAutomationSerializedState } from './contracts-automation-serialized-state';
import { IContractAssignment } from './contract-assignment';
import { IMakeContractAutomationStateArgs } from './make-contract-assignment-state-args';

export interface IContractsAutomationState extends ISerializeable<IContractsAutomationSerializedState> {
  listContractAssignments(): IContractAssignment[];
  getContractAssignmentById(id: string): IContractAssignment | undefined;
  getContractAssignmentByDistrictAndContract(
    districtIndex: number,
    contractName: string,
  ): IContractAssignment | undefined;
  addContractAssignment(parameters: IMakeContractAutomationStateArgs): void;
  removeContractAssignmentById(id: string): void;
  removeAllContractAssignments(): void;
  removeCloneFromAssignments(cloneId: string): void;
  moveContractAssignment(id: string, position: number): void;
  toggleAllContractAssignments(active: boolean): void;
  startAll(): void;
}

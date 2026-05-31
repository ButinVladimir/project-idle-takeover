import { ISerializeable } from '@shared/index';
import { IDistrictState } from '@state/city-state';
import { IClone } from '@state/clones-state';
import { IContractsAutomationSerializedState } from './contracts-automation-serialized-state';
import { IContractAssignment } from './contract-assignment';
import { IContractAssignmentsStarter } from './contract-assignments-starter';

export interface IContractsAutomationState extends ISerializeable<IContractsAutomationSerializedState> {
  starter: IContractAssignmentsStarter;
  listContractAssignments(): IContractAssignment[];
  getContractAssignmentById(id: string): IContractAssignment | undefined;
  getContractAssignmentByDistrictAndContract(
    districtIndex: number,
    contractName: string,
  ): IContractAssignment | undefined;
  addContractAssignments(contractNames: string[], districtIndexes: IDistrictState[], clones: IClone[]): boolean;
  removeContractAssignmentById(id: string): void;
  removeContractAssignmentsByIds(ids: string[]): void;
  removeCloneFromAssignments(cloneId: string): void;
  moveContractAssignment(id: string, position: number): void;
}

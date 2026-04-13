import { IContractAssignment } from './contract-assignment';

export interface IContractAssignmentsStarter {
  checkContractAssignment(contractAssignment: IContractAssignment): boolean;
  startAssignment(contractAssignmentId: string): boolean;
  startAssignments(contractAssignemntIds: string[]): boolean;
  autostart(actionCount: number): boolean;
}

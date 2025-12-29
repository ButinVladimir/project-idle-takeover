import { IContractAssignment } from './contract-assignment';

export interface IContractAssignmentsStarter {
  checkContractAssignment(contractAssignment: IContractAssignment): boolean;
  startAssignment(contractAssignmentId: string): boolean;
  startAllAssignments(): boolean;
  autostart(actionCount: number): boolean;
}

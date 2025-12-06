import { IContract } from '@state/activity-state';

export interface IContractAssignmentArguments {
  id: string;
  contract: IContract;
  active: boolean;
}

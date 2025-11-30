import { IContract } from '@state/activity-state';

export interface IContractAutomationStateArguments {
  id: string;
  contract: IContract;
  active: boolean;
}

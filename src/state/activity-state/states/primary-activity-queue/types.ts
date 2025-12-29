export type PrimaryActivityType = 'contract';

export enum PrimaryActivityState {
  inactive = 'inactive',
  active = 'active',
  finishedPerforming = 'finishedPerforming',
  toBeRemoved = 'toBeRemoved',
}

export enum PrimaryActivityPerformResult {
  continue = 'continue',
  abort = 'abort',
  reward = 'reward',
}

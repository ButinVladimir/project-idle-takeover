import { IContract } from '@state/activity-state';
import { ISerializedContractAssignment } from './serialized-contract-assignment';

export interface IContractAssignment {
  id: string;
  contract: IContract;
  active: boolean;
  canBeStarted(): boolean;
  start(): void;
  toggleActive(active: boolean): void;
  serialize(): ISerializedContractAssignment;
  removeAllEventListeners(): void;
}

import { IContract } from '@state/activity-state';
import { ISerializedContractAssignment } from './serialized-contract-assignment';

export interface IContractAssignment {
  id: string;
  contract: IContract;
  active: boolean;
  canBeRepeated(): boolean;
  toggleActive(active: boolean): void;
  serialize(): ISerializedContractAssignment;
  removeAllEventListeners(): void;
}

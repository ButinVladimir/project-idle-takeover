import { IContract } from '@state/activity-state';
import { ISerializedContractAssignment } from './serialized-contract-assignment';

export interface IContractAssignment {
  id: string;
  contract: IContract;
  enabled: boolean;
  toggleEnabled(enabled: boolean): void;
  serialize(): ISerializedContractAssignment;
  removeAllEventListeners(): void;
}

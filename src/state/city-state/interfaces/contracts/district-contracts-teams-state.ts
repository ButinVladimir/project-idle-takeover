import { IClone } from '@state/clones-state';
import { IDistrictContractsTeamsSerializedState } from '../serialized-states';

export interface IDistrictContractsTeamsState {
  setTeam(contractName: string, clones: IClone[]): void;
  getTeam(contractName: string): void;
  serialize(): IDistrictContractsTeamsSerializedState;
  deserialize(serializedState: IDistrictContractsTeamsSerializedState): void;
}
